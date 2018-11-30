
exports.onCreateNode = (
  { actions, node },
  options
) => {
  const { type } = node.internal

  if (type !== (options.matchNodeType)) return

  options.extract.forEach(({ name, selector, replacer }) => {
    const value = node.fileAbsolutePath.replace(selector, replacer)

    if (value !== null && value !== node.fileAbsolutePath) {
      actions.createNodeField({
        node,
        name,
        value,
      })
    }
  })
}
