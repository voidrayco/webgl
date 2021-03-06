This is a WebGL foundation library that VoidRay uses in our visualizations.

## Running

[![Greenkeeper badge](https://badges.greenkeeper.io/voidrayco/webgl.svg?token=ff0e3680fec01bfacbac4346e332401d4f65f4d29316223bc4c48306bb959487&ts=1508260009323)](https://greenkeeper.io/)

This project is using the node version from package.json. At the time of writing
this, that version is `7.10.1`

Install dependencies

```sh
npm install
# or
yarn install
```

Then for development run

```sh
npm run dev
```

To do a quick build and lint check run

```sh
npm run build
```

## Contributing

- Every task MUST begin with a JIRA ticket key. Locate the ticket and note the ticket number and the subject of the ticket. The key should look like `WEBGL-14`

- Move the JIRA ticket to `In Progress`

- Next create a new branch based off of the latest code (usually in master or dev)

- The name of this branch will be as follows:

  `<feature | hotfix | task>/<PROJECT-Ticket #>-<Ticket subject kabob case>`

  > hotfix is used for bugs, task is used for misc, feature is for features
  >
  > Eg - I have a ticket VOIDRAY-253 with the title Fix this stuff
  >     My branch name will be:
  >
  > hotfix/VOIDRAY-253-fix-this-stuff
  >
  > Eg - I have another ticket for a feature VOIDRAY-2384 with the title
  >      Make me something!
  >
  > feature/VOIDRAY-2384-make-me-something

- You now have a branch to work in! Make your changes and commit your changes. Then push to the repo using the exact same name as the branch.

- Now create a Pull Request from the UI or the CLI

- Wait for someone to review your pull request, then you merge your own PR when it's approved.

## Developing

    Save multiple times for the linter to automatically correct many linting issues!

Our primary development environment is [Visual Studio Code].

[Visual Studio Code]: https://code.visualstudio.com/

It is recommended to have the following plugins:

- TSLint ([eg2.tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint))
- EditorConfig ([EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig))

You can browse the plugins list for any other helpful features you would like, so long as the feature does not create conflicts with VoidRay's [style guide](https://docs.google.com/document/d/1BGdhltNCKcxcUsNr9MrcIPPFjaSOL4gP1uhcnhcy5rQ/edit#heading=h.pwyf2uw9gb6s).
