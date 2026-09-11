// Serves the site sitemap at /sitemap.xml during static builds and preview.
import type { APIRoute } from 'astro';
import { buildSitemapXml, getSitePaths } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = () => {
	const site = import.meta.env.SITE;

	if (!site) {
		return new Response('Site URL is not configured.', { status: 500 });
	}

	const xml = buildSitemapXml(site, getSitePaths());

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
