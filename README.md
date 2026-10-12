# Juanito Hacienda

A multi-page website for a fictional Mexican restaurant, built with plain HTML, CSS and JavaScript. No build step and no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, favorites, hours, testimonial |
| `menu.html` | Filterable and searchable menu (data lives in `js/main.js`) |
| `reviews.html` | Sample reviews, rating filter, leave-a-review form |
| `about.html` | Story, timeline, values, team |
| `events.html` | Weekly events, private dining, catering inquiry form |
| `reservations.html` | Reservation request form |
| `contact.html` | Contact info, form, FAQ |
| `404.html` | Custom not-found page |

## Project structure

```
juanito-hacienda/
├── index.html
├── menu.html
├── reviews.html
├── about.html
├── events.html
├── reservations.html
├── contact.html
├── 404.html
├── css/style.css
└── js/main.js
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy: GitHub → Vercel

1. Create a new repository on GitHub (for example `juanito-hacienda`).
2. Upload everything in this folder to the **root** of the repo (so `index.html` is at the top level, not inside a subfolder).
   - Via the web: on the repo page choose **Add file → Upload files**, drag in all files and folders, and commit.
   - Or via the command line:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/juanito-hacienda.git
     git push -u origin main
     ```
3. Go to [vercel.com](https://vercel.com), sign in with GitHub and click **Add New → Project**.
4. Import the repository. Leave **Framework Preset** as **Other**, and leave the build command and output directory empty.
5. Click **Deploy**. Vercel will give you a live URL, and every push to `main` redeploys automatically.

## Customizing

- **Menu items:** edit the `MENU` array in `js/main.js`.
- **Sample reviews:** edit `SAMPLE_REVIEWS` in `js/main.js`.
- **Colors and fonts:** change the variables at the top of `css/style.css`.
- **Hours:** update the `HOURS` object in `js/main.js` (drives the "open now" badge) and the hours tables in the HTML.
- **Photos:** the site uses emoji and color blocks as placeholders. Add images to an `images/` folder and swap them in.

## Forms

The reservation, contact, events and review forms validate input, but **they do not send data anywhere** (this is a demo). Reviews are saved only in the visitor's own browser (`localStorage`). To receive real submissions, connect a form service such as Formspree or Netlify-style form handlers, or add a Vercel serverless function.

## Note

Juanito Hacienda is a fictional business. The address, phone number, email and reviews are made up for demonstration purposes.
