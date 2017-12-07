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

AUTORELEASE_BASE:       The base branch for pull requests. Defaults to 'master'
AUTORELEASE_KEY:        Please create a deploy key with write access and
                        paste the private key in this environment variable. You can
                        separate multiple lines with a literal \n if necessary. You
                        can create a key on linux / osx with "ssh-keygen -f ./key"
                        and you can upload the public key to /settings/keys on your
                        repo (https://github.com/:owner/:repo/settings/keys)
AUTORELEASE_TOKEN:      Create a personal access token by going to
                        https://github.com/settings/tokens
AUTORELEASE_ADD_BRANCH: This will be a comma delimited list of additional branches
                        this scrpt will push to after the rlese script has completed.
`;

const { appendFileSync, existsSync, mkdtempSync, writeFileSync, mkdirSync } = require('fs');
const { dirname, join, resolve } = require('path');
const { spawnSync } = require('child_process');
const { tmpdir } = require('os');
const { inc } = require('semver');
const fetch = require('node-fetch');

// Import environment variables
const {
  AUTORELEASE_ADD_BRANCH,
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
  if (result.status) throw new Error(result.stdout.toString('ascii'));
  return result;
}

// Don't run if the commit was from this script
const author = exec('git', ['log', '-n', '1', '--pretty=format:%an'])
.stdout.toString('ascii');

if (author === 'Autorelease Script') {
  console.log('This commit was from Autorelease. Refusing to re-release.');
  process.exit(0);
}

// Determine which release we're going to use
const [FEATURE, RELEASE_TYPE = 'patch'] = WERCKER_GIT_BRANCH.split('/');

if (FEATURE !== 'release') {
  console.error('This is not a release branch, so not creating a release');
  process.exit(0);
}

const packageJson = require(resolve('package.json'));
const devJson = JSON.parse(
  exec('git', ['show', `${AUTORELEASE_BASE}:package.json`])
  .stdout.toString('ascii')
);

const NEXT_VERSION = inc(devJson.version, RELEASE_TYPE);

if (NEXT_VERSION) {
  console.log(`Preparing ${RELEASE_TYPE} release from ${packageJson.version} to ${NEXT_VERSION}`);
  packageJson.version = NEXT_VERSION;
}
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

try {
  // Only attempt creating if the file does not exist
  if (!existsSync(dirname(SSH_CONFIG)))
    mkdirSync(dirname(SSH_CONFIG), [0o600]);
}

catch (err) {
  console.log('Issue with ensuring the ssh folder');
  console.log(err && (err.stack || err.message));
}

// Create the SSH deploy key
writeFileSync(ID_RSA, AUTORELEASE_KEY.replace(/\\n/g, '\n'), { mode: 0o400 });
appendFileSync(SSH_CONFIG, `
Host autorelease
  User git
  HostName ${WERCKER_GIT_DOMAIN}
  IdentityFile ${ID_RSA}`, { mode: 0o600 }
);

// Add github.com to known_hosts
appendFileSync(
  KNOWN_HOSTS,
  'github.com,192.30.252.*,192.30.253.*,192.30.254.*,192.30.255.* ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQE' +
  'Aq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp' +
  '5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZ' +
  'ETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTv' +
  'KSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3R' +
  'cT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbO' +
  'DqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ=='
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

try {
  exec('git', ['commit', '-m', `Release ${NEXT_VERSION}`]);
  exec('git', ['push', 'origin', WERCKER_GIT_BRANCH]);
}
catch (error) {
  // Swallow this error message
  if (!/nothing to commit/i.test(error.message)) throw error;
}

// Regardless if the release branch pushed or not, we should still push to the
// additional branches to ensure they are in sync
// This will attempt to push the release to all of the specified additional branches
if (AUTORELEASE_ADD_BRANCH) {
  const branches = AUTORELEASE_ADD_BRANCH.split(',');

  branches.forEach(branch => {
    const options = branch.split(':');
    branch = options[0];
    const additionalArgs = options[1];
    let args = ['push'];

    if (additionalArgs)
      args.push(additionalArgs);

    args = args.concat(['origin', `${WERCKER_GIT_BRANCH}:${branch}`]);

    try {
      exec('git', args);
    }

    catch (err) {
      console.log('Could not push the additional branch:', branch);
      console.log('ADD BRANCH value:', AUTORELEASE_ADD_BRANCH);
      console.log(err.message);
    }
  });
}

/**
 * Makes the PR for this release
 */
async function makePullRequest() {
  const PULL_URL = `https://api.github.com/repos/${WERCKER_GIT_OWNER}/${WERCKER_GIT_REPOSITORY}/pulls`;
  const PR_TITLE = `Release ${NEXT_VERSION}`;

  const pullRequestQuery = {
    title: PR_TITLE,
    body: `Auto build of request ${NEXT_VERSION}`,
    head: WERCKER_GIT_BRANCH,
    base: AUTORELEASE_BASE,
  };

  const pullRequestParams = {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${AUTORELEASE_TOKEN}`,
      'User-Agent': 'Auto-upgrade bot by @tarwich',
    },
  };

  console.log(
    'Searching for PRs',
    `${PULL_URL}?base=${pullRequestQuery.base}&head=${WERCKER_GIT_OWNER}:${pullRequestQuery.head}`
  );

  const getPRResponse = await fetch(
    `${PULL_URL}?base=${pullRequestQuery.base}&head=${WERCKER_GIT_OWNER}:${pullRequestQuery.head}`,
    pullRequestParams
  );

  if (!getPRResponse.ok) {
    console.log('Could not fetch: GET existing PRs');
    process.exit(1);
  }

  const foundPulls = await getPRResponse.json();
  console.log('Existing PRs found:', foundPulls.length);

  if (foundPulls.length === 0) {
    // To make a PR you POST instead of GET
    pullRequestParams.method = 'POST';
    pullRequestParams.body = JSON.stringify(pullRequestQuery);
    const makePRResponse = await fetch(PULL_URL, pullRequestParams);

    if (makePRResponse.ok)
      console.log('PR successfully created');

    else {
      console.log('Could not fetch: POST creating the PR');
      process.exit(1);
    }
  }
}

try {
  makePullRequest();
}

catch (error) {
  console.log('Could not make pull request');
  console.log(error && (error.stack || error.message));
}
