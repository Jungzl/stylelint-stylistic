import stylelint from 'stylelint'

const { createPlugin, utils } = stylelint

const { isCustomProperty, isStandardSyntaxProperty, report, ruleMessages, validateOptions, optionsMatches, validateTypes: { isRegExp, isString }, typeGuards: { isRule } } = utils

const ruleName = 'stylistic/property-case'

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/property-case',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => (root, result) => {
  const validOptions = validateOptions(
    result,
    ruleName,
    {
      actual: primary,
      possible: ['lower', 'upper'],
    },
    {
      actual: secondaryOptions,
      possible: {
        ignoreSelectors: [isString, isRegExp],
      },
      optional: true,
    },
  )

  if (!validOptions) {
    return
  }

  root.walkDecls((decl) => {
    const { prop } = decl

    if (!isStandardSyntaxProperty(prop)) {
      return
    }

    if (isCustomProperty(prop)) {
      return
    }

    const { parent } = decl

    if (!parent) throw new Error('A parent node must be present')

    if (isRule(parent)) {
      const { selector } = parent

      if (selector && optionsMatches(secondaryOptions, 'ignoreSelectors', selector)) {
        return
      }
    }

    const expectedProp = primary === 'lower' ? prop.toLowerCase() : prop.toUpperCase()

    if (prop === expectedProp) {
      return
    }

    if (context.fix) {
      decl.prop = expectedProp

      return
    }

    report({
      message: messages.expected(prop, expectedProp),
      word: prop,
      node: decl,
      ruleName,
      result,
    })
  })
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
