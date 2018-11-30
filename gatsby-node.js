
exports.onCreateNode = (
  { actions, node },
  options
) => {
  const { type } = node.internal

  if (type !== (options.matchNodeType)) return

  options.extract.forEach(extractor => {
    const result = node.fileAbsolutePath.replace(extractor.selector, extractor.replacer)

    if (result !== null && result !== node.fileAbsolutePath) {
      actions.createNodeField({
        node,
        name: extractor.name,
        value: result
      })
    }
  })
}
