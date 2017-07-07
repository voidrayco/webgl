This is a WebGL foundation library that VoidRay uses in our visualizations.

## Running

Run

`npm install`
or
`yarn install`

Then for development run

```npm run dev```

To do a quick build and lint check run

`npm run build`

## Contributing
(Process for pull requests. Mention git-flow and using jira ticket keys at the start of the branch name

- Every task MUST begin with a `JIRA ticket`. Locate the ticket and note the ticket number and the subject of the ticket.

- Move the ticket to `In Progress`

- Next create a `new branch` based off of the latest code (usually in master or dev)

- The name of this branch will be as follows:

  `<feature | hotfix | task>/<PROJECT-Ticket #>-<Ticket subject kabob case>`

  > hotfix is used for bugs, task is used for misc, feature is for features

  > Eg - I have a ticket VOIDRAY-253 with the title Fix this stuff
  >     My branch name will be:

  > hotfix/VOIDRAY-253-fix-this-stuff

  > Eg - I have another ticket for a feature VOIDRAY-2384 with the title
  >      Make me something!

  > feature/VOIDRAY-2384-make-me-something

- You now have a branch to work in! Make your changes and commit your changes. Then push to the repo using the exact same name as the branch.

- Now create a Pull Request from the UI or the CLI

- The request MUST be reviewed. After review, you will make any necessary changes. After changes are made, push for review again. Once approved, an authorized individual will merge the change.

## Developing
Mention VS Code, any useful extensions, and anything in "scripts" of package.json that might be useful

Our primary development environment is `Visual Studio Code`.

It is recommended to have the following plugins:

- TSLint
- Document This

You can browse the plugins list for any other helpful features you would like, so long as the feature does not create conflicts with VoidRay's style guide.
