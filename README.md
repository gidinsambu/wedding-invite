# Enoch & Sylivia Wedding Invitation

Static wedding invitation site with personalized guest links.

## Files

- `index.html` is the invitation page.
- `styles.css` controls the visual design.
- `script.js` handles countdown, card switching, calendar download, RSVP links, and guest personalization.
- `guests.js` stores guest codes and display names.
- `generator.html` is the local guest link generator.
- `generator.js` powers the guest link generator.
- `assets/` contains the invitation card images.

## Run Locally

Because this is a static site, you can open `index.html` directly in a browser. For the closest match to a hosted website, run a local server from this folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Open the generator at:

```text
http://localhost:8000/generator.html
```

## Personalized Guest Links

Guest links use the `guest` URL parameter:

```text
http://localhost:8000/index.html?guest=gideon-kalanzi
```

The code after `guest=` must exist in `guests.js`:

```js
window.INVITE_GUESTS = {
  "gideon-kalanzi": "Gideon Kalanzi",
};
```

To add more people, add entries like this:

```js
window.INVITE_GUESTS = {
  "gideon-kalanzi": "Gideon Kalanzi",
  "sarah-nabunya": "Sarah Nabunya",
  "mr-and-mrs-kato": "Mr. and Mrs. Kato",
};
```

Then share links like:

```text
https://your-site.com/index.html?guest=sarah-nabunya
https://your-site.com/index.html?guest=mr-and-mrs-kato
```

## Generate Many Links

1. Open `generator.html`.
2. Check that the invitation URL is correct for where the site will be hosted.
3. Paste guest names into the `New Guests` box, one name per line.
4. Copy the generated invite links.
5. Copy the generated guest entries into `guests.js`.
6. Save and upload/deploy the updated files.

Important: a new generated link only works after its guest code has been added to `guests.js`.

## Hosting Anywhere

This project does not need Node, npm, a database, or a build command. Upload the whole folder to any static host, including:

- Netlify
- Vercel static hosting
- Cloudflare Pages
- cPanel/shared hosting
- GitHub Pages

Make sure these files stay together at the site root:

```text
index.html
styles.css
script.js
guests.js
generator.html
generator.js
assets/
```

After hosting, update the generator's `Invitation URL` field to the real public URL before generating final links.

## Hosting on GitHub Pages

Recommended setup for this project:

1. Push this folder to a GitHub repository.
2. On GitHub, open the repository.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Choose your main branch, usually `main`.
6. Choose the folder `/ (root)`.
7. Save.

GitHub will publish the site at a URL like:

```text
https://your-username.github.io/your-repository-name/
```

Your personalized links will look like:

```text
https://your-username.github.io/your-repository-name/index.html?guest=gideon-kalanzi
```

GitHub's official Pages documentation confirms that branch publishing can use either the repository root `/` or `/docs` as the source folder:

```text
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
```

## If You Use a Custom Domain

After GitHub Pages is working, add the custom domain in the repository's `Settings` -> `Pages` screen. Then generate invite links using the custom domain:

```text
https://yourdomain.com/index.html?guest=gideon-kalanzi
```

## Privacy Note

This is a static website. Anyone who knows how to inspect the site files can see the names stored in `guests.js`. Do not put sensitive private information in the guest list.
