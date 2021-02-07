
# Multi User Domain - Clientside Tools

The Multi User Domain project has the objective of building an open-source platform for Multi-User Domains. Linked-Data Servers providing Turtle and N3 content produce the bulk of the functionality, see the [MUD Jena project](https://github.com/Multi-User-Domain/mud-jena) for more information.

Currently this repository defines all of the React extensions for helping to interface with the [MUD vocabularies](https://github.com/Multi-User-Domain/vocab) and for building a client-side app to interface with MUD servers. It also implements a specific client for interfacing with them, which when the repository is more mature will be separated from this repository (https://github.com/Multi-User-Domain/mud-react/issues/2).

Forking this repository or creating an alternative client should be done only to offer new **interface** features, providing content, actions or new Domains should be done serverside. To fit in well with the semantic web the clientside should be designed to be **backend agnostic** as much as possible.

Tech Stack:

- Inrupt [Solid React SDK](https://github.com/inrupt/solid-ui-react) and JavaScript libraries
- React
- TypeScript

# Getting Started Locally

* Follow the Getting started locally of [MUD Jena](https://github.com/Multi-User-Domain/mud-jena#getting-started-locally) and get a local Tomcat World Server running
* Register an account with a Solid POD provider, for example at [inrupt.net](https://inrupt.net/). Solid PODs store user data, it allows the user control over their game and it is what allows them to easily take their characters to different world servers using one account (Solid-OIDC)
* Manually copy the contents of https://calum.inrupt.net/public/collections/characters.ttl into an equivalent file in your POD
* Manually copy the contents of https://calum.inrupt.net/public/mudcard.ttl into your POD and change the value of the CharacterList to the location of the Character collection you just created. Sorry this is all manual, there is an [open issue](https://github.com/Multi-User-Domain/mud-react/issues/7) to automate it... open a PR please? :)
* Add a link to your MUD-Card in your profile card. See mine for an example https://calum.inrupt.net/profile/
* Clone this repository locally
* run `yarn install` to install the dependencies and run `npm run dev` to give it a go. Make sure your local Tomcat server is running at `http://localhost:8080/` and then you can log in via your POD and get started! The app will run and auto-update at `https://localhost:3000/`. The HTTPS isn't a typo
