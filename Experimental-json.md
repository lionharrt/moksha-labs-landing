Experimental Json format

PROJECT CONTEXT

The goal of this project is to simplify and accelerate how we build websites.

We’re experimenting with a JSON-first approach:

Each section of the website (Intro, Horizontal Track, About, Services, Contact, Footer) is described in JSON.

Instead of hardcoding everything in HTML/CSS/JS, we let an AI builder or a renderer parse the JSON and generate the layout, styles, and animations.

This makes it faster to prototype, test, and adjust. We just edit JSON values (fonts, colors, text, animations) rather than rewriting code.

If this workflow works as expected, every future web project can be started the same way:

Define the website structure section by section in JSON.

Feed it into the builder to instantly generate a working preview.

Iterate quickly by adjusting content and style in the JSON.

The idea is to develop this into a repeatable, scalable method for fast, high-quality website production.

1. Intro Splash — Logo + Halo

{

  "id": "intro_splash",

  "type": "section",

  "theme": {

    "background": "#000000",

    "text": "#FFFFFF"

  },

  "assets": {

    "logo": {

    "text": "Moksha Labs",

    "font": "Monument Extended",

    "size": "108px",

    "weight": 800,

    "color": "#FFFFFF"

    },

    "halo": {

    "type": "radial-glow",

    "center": "50% 40%",

    "innerRadius": 120,

    "outerRadius": 360,

    "colors": [

    "rgba(31,51,255,0.95)",

    "rgba(31,51,255,0.30)",

    "transparent"

    ],

    "blur": 120

    }

  },

  "animate": {

    "entrance": [

    {"target": "halo", "effect": "fadeIn", "duration": 900},

    {"target": "logo", "effect": "fadeUp", "duration": 800, "delay": 250}

    ],

    "loop": [

    {"target": "halo", "effect": "scale", "values": [1, 1.05, 1], "duration": 6000}

    ]

  },

  "interactions": {

    "onScroll": {"to": "horizontal_track", "duration": 700}

  }

}

2. Horizontal Track (3 Panel)

{

  "id": "horizontal_track",

  "type": "track",

  "scroll": {"direction": "horizontal", "snap": "panel"},

  "background": {

    "type": "animated-gradient",

    "stops": ["#0D1F1A", "#118C6F", "#0D1F1A"],

    "grain": 0.15

  },

  "header": {

    "logo": {"text": "debz", "font": "Monument Extended", "color": "#FFFFFF"},

    "nav": {

    "items": ["Home", "About", "Services", "Contact"],

    "font": "Monument Extended",

    "size": "18px",

    "color": "#FFFFFF",

    "spacing": "40px"

    },

    "cta": {

    "label": "Get In Touch",

    "size": "16px",

    "background": "#FFFFFF",

    "labelColor": "#2F2F2F",

    "hoverBackground": "#F4B900",

    "hoverLabelColor": "#FAFAFA"

    }

  },

  "panels": [

    {

    "id": "panel_hero",

    "content": {

    "headline": {

    "text": "We create cutting-edge digital experiences where stories, design, and technology unite.",

    "font": "Monument Extended",

    "size": "96px",

    "color": "#FFFFFF",

    "align": "center"

    }

    }

    },

    {

    "id": "panel_grid",

    "content": {

    "grid": {

    "rows": 2,

    "cols": 2,

    "tileSize": "368x232",

    "opacityDefault": 0.06,

    "opacityHover": 1.0,

    "transition": 400

    },

    "overlay": {

    "text": "From ancient myths to digital media, storytelling is the timeless art that shapes our future.",

    "font": "Editorial New Italic",

    "size": "28px",

    "color": "#FFFFFF",

    "align": "center"

    }

    }

    },

    {

    "id": "panel_manifesto",

    "content": {

    "paragraph": {

    "text": "Stories have always shaped how we see the world—but today, technology lets us live them. At Moksha Labs, we specialize in creating immersive experiences where audiences step inside the story. Whether it's branding, digital design, apps, websites, chatbots, or social media, we transform visions into interactive realities—where creativity and technology move as one.",

    "font": "Monument Extended",

    "size": "28px",

    "color": "#FFFFFF",

    "align": "center"

    }

    },

    "exit": {"pivotTo": "vertical_stack"}

    }

  ]

}

3. About Section

{

  "id": "about",

  "type": "section",

  "theme": {"background": "#FAFAFA", "text": "#0F0F0F"},

  "header": {"sticky": true},

  "content": {

    "title": {

    "text": "Who we really are",

    "font": "Monument Extended",

    "size": "56px",

    "color": "#0F0F0F",

    "highlight": {"word": "really", "font": "Editorial New Italic"}

    },

    "columns": [

    {

    "width": "567x408",

    "text": "At Moksha Labs, we're a small but mighty crew, driven by a shared passion for helping ambitious small to medium-sized businesses and startups reach their digital potential. We thrive on the challenge of creating original, high-impact work that truly moves the needle.",

    "font": "Monument Extended",

    "size": "32px",

    "highlights": ["ambitious", "reach", "digital potential", "original", "high-impact"]

    },

    {

    "width": "612x408",

    "text": "What sets us apart? We're not about cookie-cutter solutions. Every project we take on is custom-tailored to fit your specific needs and dreams. We immerse ourselves in your business, becoming an extension of your team to craft strategies that deliver tangible results, all while keeping a close eye on timely delivery.",

    "font": "Monument Extended",

    "size": "32px",

    "highlights": ["custom-tailored", "needs", "dreams", "craft", "deliver", "timely delivery"]

    }

    ],

    "bottomText": {

    "text": "We're here to help you grow, in a way that feels authentic and works perfectly for you. Let's connect and see what we can achieve together!",

    "size": "28px",

    "area": "1248x102"

    }

  }

}

4. Services Section

{

  "id": "services",

  "type": "section",

  "theme": {"background": "#FFFFFF", "text": "#0F0F0F"},

  "title": {

    "text": "What we do",

    "font": "Monument Extended",

    "size": "48px",

    "color": "#0F0F0F"

  },

  "cards": [

    {"title": "Web Development", "desc": "Custom websites that combine aesthetics with performance."},

    {"title": "CRM Solutions", "desc": "Streamlined systems to help you manage clients efficiently."},

    {"title": "Chatbots & Automation", "desc": "Smart bots and flows to save time and scale support."},

    {"title": "Brand Identity", "desc": "Logos, palettes, and typography that define your story."},

    {"title": "Brand Implementation", "desc": "Consistent roll-out of your brand across every channel."}

  ]

}

5. Contact Section

{

  "id": "contact",

  "type": "section",

  "theme": {"background": "#0D1F1A", "text": "#FFFFFF"},

  "title": {

    "text": "Let’s talk",

    "font": "Monument Extended",

    "size": "48px",

    "color": "#FFFFFF"

  },

  "form": {

    "fields": [

    {"type": "text", "placeholder": "Your Name"},

    {"type": "email", "placeholder": "Email"},

    {"type": "textarea", "placeholder": "Project Brief"}

    ],

    "cta": {

    "label": "Get In Touch",

    "background": "#FFFFFF",

    "labelColor": "#2F2F2F",

    "hoverBackground": "#F4B900",

    "hoverLabelColor": "#FAFAFA"

    }

  }

}

6. Footer

{

  "id": "footer",

  "type": "section",

  "theme": {"background": "#000000", "text": "#FFFFFF"},

  "content": {

    "left": "© 2025 Moksha Labs — All rights reserved.",

    "right": ["LinkedIn", "Instagram"]

  }

}

* 
* [1]()
* [2]()
* [3]()
* [4]()
* [•••]()
