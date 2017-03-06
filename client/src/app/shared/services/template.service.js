import fetch from 'helpers/fetch'
import panelService from './panel.service'

const compareByOrder = (a, b) => {
  if (a.order === b.order) {
    return 0
  }
  return a.order > b.order ? 1 : -1
}

async function graphql (query = '', variables) {
  const params = {
    query: query.replace(/\n/g, ' ').replace(/\s+/g, ' ')
  }
  if (variables) {
    params.variables = JSON.stringify(variables)
  }
  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  const { data } = await resp.json()
  if (!data) {
    throw new Error('Failed to fetch query.')
  }
  return data
}

async function query () {
  const data = await graphql(`
    query {
      templates {
        id
        name
        createdAt
        updatedAt
      }
    }
  `)

  if (!data || !data.templates) {
    throw new Error('Failed to load the items.')
  }
  return data.templates
}

async function get (id) {
  const data = await graphql(`
    query ($id: ID!) {
      template(id: $id) {
        id
        name
        panels {
          edges {
            node {
              id
              name
              size
              order
              adSchemaForms {
                edges {
                  node {
                    id
                    type
                    name
                    size
                    order
                    properties
                  }
                }
              }
            }
          }
        }
        createdAt
        updatedAt
      }
    }
  `, { id: id })
  if (!data || !data.template) {
    throw new Error('Failed to load the item.')
  }
  data.template.panels = data.template.panels || []
  if (data.template.panels.edges) {
    data.template.panels = data.template.panels.edges.map((_panel) => {
      if (!_panel.node) {
        throw new Error('Failed to load the item.')
      }
      _panel.node.adSchemaForms = _panel.node.adSchemaForms || []
      if (_panel.node.adSchemaForms.edges) {
        _panel.node.adSchemaForms = _panel.node.adSchemaForms.edges.map((_adSchemaForm) => {
          if (!_adSchemaForm.node) {
            throw new Error('Failed to load the item.')
          }
          try {
            _adSchemaForm.node.properties = JSON.parse(_adSchemaForm.node.properties)
          } catch (e) {
            _adSchemaForm.node.properties = {}
          }
          return _adSchemaForm.node
        }).sort(compareByOrder)
      }
      return _panel.node
    }).sort(compareByOrder)
  }
  return data.template
}

// async function add ({ name, connector, fields }) {
async function add ({ name }) {
  const data = await graphql(`
    mutation ($input: addTemplateInput!) {
      addTemplate(input: $input) {
        changedTemplateEdge {
          node {
            id
            name
            createdAt
            updatedAt
          }
        }
      }
    }
  `, {
    input: {name}
  })

  if (!data || !data.addTemplate || !data.addTemplate.changedTemplateEdge || !data.addTemplate.changedTemplateEdge.node) {
    throw new Error('Failed to add the item.')
  }
  return data.addTemplate.changedTemplateEdge.node
}

async function update ({ id, name, panels }) {
  panels = panels.map((panel, i) => {
    let data = {
      id: panel.id,
      name: panel.name || 'panel ' + parseInt(Math.random() * 10000),
      adSchemaForms: panel.adSchemaForms || [],
      size: panel.size,
      order: i
    }
    if (!data.id || data.id.search(/^tmp-/) !== -1) {
      delete data.id
    }
    return data
  })
  // const results = await panelService.save(panels)

  panels = (await panelService.save(panels)).map((each) => {
    return each.id
  })

  // let results2 = await templateService.update({
  //   id: this.props.item.id,
  //   name: this.props.item.name,
  //   panels: results.map((each) => {
  //     return each.id
  //   })
  // })

  // mutation ($id: ID!, $name: String!) {
  //   updateTemplate(input: {id: $id, name: $name}) {
  const data = await graphql(`
    mutation ($input: updateTemplateInput!) {
      updateTemplate(input: $input) {
        changedTemplate {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  `, {
    input: {id, name, panels}
  })

  if (!data || !data.updateTemplate || !data.updateTemplate.changedTemplate) {
    throw new Error('Failed to update the item.')
  }
  return data.updateTemplate.changedTemplate
}

async function remove (id) {
  const data = await graphql(`
    mutation ($id: ID!) {
      deleteTemplate(input: {id: $id}) {
        ok
      }
    }
  `, { id: id })

  if (!data || !data.deleteTemplate || !data.deleteTemplate.ok) {
    throw new Error('Failed to delete the item.')
  }
  return data.deleteTemplate.ok
}

export default {query, get, add, update, remove}
