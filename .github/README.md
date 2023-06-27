# Luna's Minecraft Tools
Luna's Minecraft Tools (Luna MCT) is a simple web app created by Luna Pixu to provide various miscellaneous external tools and functions for Minecraft.

Currently located at: https://luna-minecraft-tools.vercel.app/

## Contributing / Running Locally
Luna MCT is created using [Nuxt](https://nuxt.com/) in [TypeScript](https://www.typescriptlang.org/). When contributing, ensure you have [node](https://nodejs.org/) and npm installed, and follow these instructions:
1. Clone the repo using [git](https://git-scm.com/) (or just download the repo manually, ig).
2. With your preferred console/terminal opened in the project folder, type `npm install`. This will install all the necessary node packages like Nuxt in order to run a local version of the site.
3. Then, type `npm run dev -- -o`.

Assuming all the steps were followed and nothing goes wrong, your web browser will automatically open a live developer view of the project running on your PC. Any changes made to the project's .vue files, and several others, will hot-reload the relevant parts of your webpage allowing you to quickly preview any changes (though you may sometimes have to hit the good ol' refresh button).

For proper local hosting, type `npm run build` in your console. This will build the website and output it into the `/.output` folder of the project. You may also type `npm run generate` to build a static version of Luna MCT for easier hosting. Static builds are not used for the official website and may have some minor differences. Keep this in mind if you run into any bugs on your own static build.

For further info, check the [contribution](./CONTRIBUTING.md) section.

## Suggesting Features/Tools
New tools or features may be suggested (and/or requested to be pulled). However, there are a few stipulations that I must add:
1. New tools must be contained within the web app itself. So, no in-game mods or anything that connects to the game client.
2. I will not provide features that are already (or soon to be) provided by [MCStacker](https://mcstacker.net) or [misode](https://misode.github.io).  
As of writing, I support MCStacker via Patreon and do not believe it's right to rip features from there. *(Besides, whatever I could do, MCStacker can do it better)*.  
Similarly, I'm an active user of misode's datapack generators so I will ask that any datapack-generating tools must be specialised and ideally provide more than just a datapack (see my [Trim Generator](https://luna-minecraft-tools.netlify.app/trimgenerator) for an example).
3. The more niche, the better. Luna's Minecraft Tools exists to provide tools that fit specific niches and help streamline them. If there's a specific Minecraft-related task that's just a bit too cumbersome, no matter how specific, I want to ease that burden.