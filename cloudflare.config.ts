import { bindings, defineConfig } from "cf/config";

/**
 * Secret-like files were detected but not read or migrated: .env.example. Only `secrets.required` entries are migrated.
 * @see https://developers.cloudflare.com/workers/configuration/secrets/
 */

/**
 * Wrangler environments are selected through ctx.mode and the cf --mode flag.
 * @see https://developers.cloudflare.com/workers/wrangler/environments/
 */

export default defineConfig((ctx) => {
	switch (ctx.mode) {
		case "staging": {
			return {
				worker: {
					name: "easy-abc-dev",
					compatibilityDate: "2026-10-01",
					compatibilityFlags: [
						"nodejs_compat",
					],
					entrypoint: "vinext/server/fetch-handler",
					workersDev: true,
					observability: {
						enabled: true,
						logs: {
							enabled: true,
							headSamplingRate: 1,
						},
						traces: {
							enabled: true,
							headSamplingRate: 0.01,
						},
					},
					assets: {
						htmlHandling: "none",
						notFoundHandling: "none",
						runWorkerFirst: [
							"/*",
							"!/_next/static/*",
						],
					},
					env: {
						BETTER_AUTH_URL: bindings.text("https://easy-abc.easy-ai.online"),
						APP_URL: bindings.text("https://easy-abc.easy-ai.online"),
						BETTER_AUTH_SECRET: bindings.secret(),
						GOOGLE_CLIENT_ID: bindings.secret(),
						GOOGLE_CLIENT_SECRET: bindings.secret(),
						TURSO_DATABASE_URL: bindings.secret(),
						TURSO_AUTH_TOKEN: bindings.secret(),
						LINE_CHANNEL_ACCESS_TOKEN: bindings.secret(),
						ASSETS: bindings.assets(),
					},
				},
			};
		}
		default: {
			return {
				worker: {
					name: "easy-abc",
					compatibilityDate: "2026-10-01",
					compatibilityFlags: [
						"nodejs_compat",
					],
					entrypoint: "vinext/server/fetch-handler",
					workersDev: false,
					observability: {
						enabled: true,
						logs: {
							enabled: true,
							headSamplingRate: 1,
						},
						traces: {
							enabled: true,
							headSamplingRate: 0.01,
						},
					},
					assets: {
						htmlHandling: "none",
						notFoundHandling: "none",
						runWorkerFirst: [
							"/*",
							"!/_next/static/*",
						],
					},
					domains: [
						"easy-abc.easy-ai.online",
					],
					env: {
						BETTER_AUTH_URL: bindings.text("https://easy-abc.easy-ai.online"),
						APP_URL: bindings.text("https://easy-abc.easy-ai.online"),
						BETTER_AUTH_SECRET: bindings.secret(),
						GOOGLE_CLIENT_ID: bindings.secret(),
						GOOGLE_CLIENT_SECRET: bindings.secret(),
						TURSO_DATABASE_URL: bindings.secret(),
						TURSO_AUTH_TOKEN: bindings.secret(),
						LINE_CHANNEL_ACCESS_TOKEN: bindings.secret(),
						ASSETS: bindings.assets(),
					},
				},
			};
		}
	}
});
