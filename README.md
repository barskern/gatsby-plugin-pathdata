# gatsby-plugin-pathdata

A plugin for [gatsby](https://www.gatsbyjs.org)  which loads data from the path of a file, and adds it into the graphql-database. This way you can avoid duplication of data. For example avoiding to define a date in the name of the markdown file and in the frontmatter. 

## Inspiration

This plugin was inspired by the situation mentionned in the introduction. I wanted to make a blog with [gatsby](https://www.gatsbyjs.org), but I know it can quickly get messy if I define a date in the name of a file and in the frontmatter. I also wanted to be able to use the name of the file as the path, so that the frontmatter of the file only contained information that was relevant to the article.

## Installation

```bash
npm install --save gatsby-plugin-pathdata
```

## Configuration

The plugin needs a few options to work. First you need to include [`gatsby-source-filesystem`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-filesystem) to source files into graphql. After that you can use this plugin to take data from the path of certain nodes and add to the fields.

This plugin takes two options: `matchNodeType` and `extract`.

- `matchNodeType` - Takes a string of a node type to match against (e.g. 'MarkdownRemark')
- `extract` - An array of `extractor`-objects

An `extractor`-object is an object which has the following keys:

- `name` - The name of the field which will be in the graphql database
- `selector` - Javascript RegEx which selects areas to extract from path
- `replacer` - String which will be the replacement of the selector

*Important to note is that behind the scenes the `string.prototype.replace()` function is used. Hence the selector needs to match with the entire filepath, and the replacer should select certain match-groups from the selector. I recommend to use [regexr.com](https://regexr.com/) to customize and try out your regex. Remember that the entire path should be selected by the regex, and then choose with groups what data you want.*

## Example

Under is an example which creates a path and a date field on all 'MarkdownRemark' nodes. 

In `gatsby-config.js`:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/src/pages/posts/`
      }
    },
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-pathdata',
      options: {
        matchNodeType: 'MarkdownRemark',
        extract: [
          {
            name: 'path',
            selector: /.+\/(\d+-\d+-\d+-[\w-]+)\.md$/,
            replacer: '/$1/'
          },
          {
            name: 'date',
            selector: /.+\/(\d+-\d+-\d+)-[\w-]+\.md$/,
            replacer: '$1'
          }
        ]
      }
    }
  ]
}
```

This `gatsby-config.js` will result in a graphql database where the 'MarkdownRemark' nodes have a `fields` object that contains a `path` and `date` field. These can be queried in the creation of pages from markdown.

### Example query

We have a file named `2018-01-20-hello-world.md` inside the `src/pages/posts/` folder. Then we execute the following query:

```graphql
{
  allMarkdownRemark {
    edges {
      node {
        fields {
          path
          date
        }
        frontmatter {
          title
        }
        html
      }
    }
  }
}
```

The result of this query will then be:

```json
{
  "data": {
    "allMarkdownRemark": {
      "edges": [
        {
          "node": {
            "fields": {
              "path": "/2018-01-20-hello-world/",
              "date": "2018-01-20"
            },
            "frontmatter": {
              "title": "Hello world"
            },
            "html": "<h1>Hello world!</h1>\n<p>This is a blogpost!</p>"
          }
        }
      ]
    }
  }
}
```

