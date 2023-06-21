# Luna's Minecraft Tools
Luna's Minecraft Tools (LMT) is a simple web app developed by Luna Pixu to provide a variety of miscellaneous external tools and functions for Minecraft.

Currently located at: https://luna-minecraft-tools.netlify.app/

## Contributing / Running Locally
LMT is created using [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/) in [TypeScript](https://www.typescriptlang.org/). When contributing, ensure you have [node](https://nodejs.org/) and npm installed, and follow these instructions:
1. Clone the repo with [git](https://git-scm.com/) (or just download the repo manually, ig).
2. With your preferred console opened in the project folder, type `npm install`. This will install all the necessary node packages such Vue and Vite in order to run a local build of the site.
3. Then, type `npm run dev`.
4. Open `localhost:5173` on your web browser.

Assuming all steps have been followed and nothing goes wrong, you will now have a live developer view of the website running on your PC. Any changes made to the project's .vue files, and several others, will hot-reload the relevant parts of your webpage allowing you to quickly preview any changes (though you may sometimes have to hit the good ol' F5 or refresh button).

For proper local hosting, type `npm run build` in your console. This will actually build the website and output it into the `/dist` folder of the project.

## Suggesting Features/Tools
New tools or features may be suggested (and/or requested to be pulled), however there are a few stipulations that I must add:
1. New tools must be contained within the web app itself. So, no in-game mods or anything that connects to the game client.
2. I will not provide features that are already (or soon to be) provided by [MCStacker](https://mcstacker.net) or [misode](https://misode.github.io).  
As of writing, I support MCStacker via Patreon and do not believe it's right to rip features from there. *(Besides, whatever I could do, MCStacker can do it better)*.  
Similarly, I'm an active user of misode's datapack generators so I will ask that any datapack-generating tools must be specialised and ideally provide more than just a datapack (see my [Trim Generator](https://luna-minecraft-tools.netlify.app/trimgenerator) for an example).
3. The more niche, the better. Luna's Minecraft Tools exists to provide tools that fit specific niches and help streamline them. If there's a specific Minecraft-related task that's just a bit too cumbersome, not matter how specific, I want to ease that burden.