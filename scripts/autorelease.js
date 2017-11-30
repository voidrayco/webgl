// Putting this up here to serve as help for people who open this script
const USAGE = `
This script will bump package.json to a new version and commit the results to
git. If you have a 'release' script in your package.json, then it will be
executed prior to the commit. Presumably this would be to update any binaries
that need updated upon release.

All you have to do in order to create a release is push to one of the following
branches, and an appropriate release and PR will be created:

release, release/patch, release/minor, release/major

The default type is "patch". This script will automatically increment version
numbers for you based on the release type.

options:
  --script: A script to run after package.json has been update and before the
            files are committed. You can do things like run a specific build
            process for your application with this argument. When your script is
            finished, it should stage its files with 'git add' so that they will
            be committed with this version.

This script needs three environment variables:

AUTORELEASE_BASE:  The base branch for pull requests. Defaults to 'master'
AUTORELEASE_KEY:   Please create a deploy key with write access and
                   paste the private key in this environment variable. You can
                   separate multiple lines with a literal \n if necessary. You
                   can create a key on linux / osx with "ssh-keygen -f ./key"
                   and you can upload the public key to /settings/keys on your
                   repo (https://github.com/:owner/:repo/settings/keys)
AUTORELEASE_TOKEN: Create a personal access token by going to
                   https://github.com/settings/tokens
                   Check all repo

`;

const { appendFileSync, chmodSync, mkdtempSync, writeFileSync } = require('fs');
const { join, resolve, dirname } = require('path');
const { spawnSync } = require('child_process');
const { tmpdir } = require('os');
const { inc } = require('semver');
const https = require('https');

// Import environment variables
const {
  AUTORELEASE_BASE = 'master',
  AUTORELEASE_KEY,
  AUTORELEASE_TOKEN,
  HOME,
  WERCKER_GIT_BRANCH,
  WERCKER_GIT_DOMAIN,
  WERCKER_GIT_OWNER,
  WERCKER_GIT_REPOSITORY,
} = process.env;

// Process arguments
const {
  SCRIPT
} = (() => {
  const options = {};
  const argv = process.argv;

  for (let x = 2; x < argv.length; ++x) {
    const [arg, ...values] = argv.split('=');
    const value = values.join('=');

    switch (arg) {
      case '--help':
        console.log(`usage: ${USAGE}`);
        process.exit(1);
        break;
      case '--script':
        options.script = values.length ? value : argv[++x];
        break;
      default:
        console.error(`Argument "${arg}" not recognized`);
        process.exit(1);
    }
  }

  return options;
})();

// Determine which release we're going to use
const [FEATURE, RELEASE_TYPE = 'patch'] = WERCKER_GIT_BRANCH.split('/');

if (FEATURE !== 'release') {
  console.error('This is not a release branch, so not creating a release');
  process.exit(0);
}

const packageJson = require(resolve('package.json'));
const NEXT_VERSION = inc(packageJson.version, RELEASE_TYPE);

if (NEXT_VERSION)
  console.log(`Preparing ${RELEASE_TYPE} release from ${packageJson.version} to ${NEXT_VERSION}`);
else {
  console.log(
    `Cannot create ${RELEASE_TYPE} release from ${packageJson.version} to ${NEXT_VERSION}`
  );
  process.exit(1);
}

const AUTORELEASE_DIR = mkdtempSync(join(tmpdir(), 'autorelease-'));
const ID_RSA = resolve(AUTORELEASE_DIR, 'id_rsa');
const SSH_CONFIG = `${HOME}/.ssh/config`;
const KNOWN_HOSTS = `${HOME}/.ssh/known_hosts`;

/**
 * Run spawnSync
 *
 * @param {string} command The command to run
 * @param {string[]} args Arguments for the command
 * @param {object} options The options
 *
 * @return {object} The result of spawnSync
 */
function exec(command, args, options = {}) {
  console.log(command, args);
  const result = spawnSync(command, args, options);
  console.log(result.stdout.toString('ascii'));
  console.log(result.stderr.toString('ascii'));
  if (result.error) throw result.error;
  if (result.status) process.exit(1);
  return result;
}
exec('mkdir', [dirname(SSH_CONFIG)], ['-m 700']);
exec('touch', [SSH_CONFIG]);
// Create the SSH deploy key
writeFileSync(ID_RSA, AUTORELEASE_KEY.replace(/\\n/g, '\n'));
chmodSync(ID_RSA, 0o400);
appendFileSync(SSH_CONFIG, `
Host autorelease
  User git
  HostName ${WERCKER_GIT_DOMAIN}
  IdentityFile ${ID_RSA}`);
chmodSync(SSH_CONFIG, 0o600);

// Add github.com to known_hosts
appendFileSync(
  KNOWN_HOSTS,
  'github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6Tb' +
  'Qa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsd' +
  'lLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+S' +
  'e8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOz' +
  'QgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA' +
  '8VJiS5ap43JXiUFFAaQ=='
);

// Create a git identity

// Checkout the branch
exec('git', ['--version']);
exec('git', ['remote', 'set-url', 'origin',
  `git@autorelease:${WERCKER_GIT_OWNER}/${WERCKER_GIT_REPOSITORY}`]
);
exec('git', ['config', '-l']);
exec('git', ['fetch', 'origin']);
exec('git', ['checkout', `${WERCKER_GIT_BRANCH}`]);

// Update package.json
writeFileSync(
  resolve('package.json'),
  JSON.stringify(packageJson, null, '  ') + '\n'
);

// Run release script if provided
if (SCRIPT) exec('node', SCRIPT);

if (packageJson.scripts && packageJson.scripts.release)
  exec('npm', ['run', 'release']);

// Configure git
exec('git', ['config', 'user.name', 'Autorelease Script']);
exec('git', ['config', 'user.email', 'tarwich+autorelease@gmail.com']);

// Create the git commit
exec('git', ['add', '.']);
exec('git', ['commit', '-m', `Release ${NEXT_VERSION}\n\n[skip ci]`]);
exec('git', ['push', 'origin', WERCKER_GIT_BRANCH]);

// Create the pull request
const request = https.request({
  host: 'api.github.com',
  path: `/repos/${WERCKER_GIT_OWNER}/${WERCKER_GIT_REPOSITORY}/pulls`,
  method: 'POST',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${AUTORELEASE_TOKEN}`,
    'User-Agent': 'Auto-upgrade bot by @tarwich',
  },
}, response => {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function(chunk) {
    console.log('BODY: ' + chunk);
  });
});

request.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

request.write(JSON.stringify({
  title: `Release ${NEXT_VERSION}`,
  body: `Auto build of request ${NEXT_VERSION}`,
  head: WERCKER_GIT_BRANCH,
  base: AUTORELEASE_BASE,
}, null, '  '));

request.end();
