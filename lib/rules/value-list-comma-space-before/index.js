import stylelint from 'stylelint'

const { createPlugin, utils, rules } = stylelint

const { declarationValueIndex, getDeclarationValue, ruleMessages, setDeclarationValue, validateOptions, whitespaceChecker } = utils
const { valueListCommaWhitespaceChecker } = rules

const ruleName = 'stylistic/value-list-comma-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ","',
  rejectedBefore: () => 'Unexpected whitespace before ","',
  expectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line list',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line list',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/value-list-comma-space-before',
  fixable: true,
}

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never', 'always-single-line', 'never-single-line'],
    })

    if (!validOptions) {
      return
    }

    /** @type {Map<import('postcss').Declaration, number[]> | undefined} */
    let fixData

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (declNode, index) => {
          const valueIndex = declarationValueIndex(declNode)

          if (index <= valueIndex) {
            return false
          }

          fixData = fixData || new Map()
          const commaIndices = fixData.get(declNode) || []

          commaIndices.push(index)
          fixData.set(declNode, commaIndices)

          return true
        }
        : null,
    })

    if (fixData) {
      for (const [decl, commaIndices] of fixData.entries()) {
        for (const index of commaIndices.sort((a, b) => b - a)) {
          const value = getDeclarationValue(decl)
          const valueIndex = index - declarationValueIndex(decl)
          let beforeValue = value.slice(0, valueIndex)
          const afterValue = value.slice(valueIndex)

          if (primary.startsWith('always')) {
            beforeValue = beforeValue.replace(/\s*$/, ' ')
          } else if (primary.startsWith('never')) {
            beforeValue = beforeValue.replace(/\s*$/, '')
          }

          setDeclarationValue(decl, beforeValue + afterValue)
        }
      }
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default createPlugin(ruleName, rule)
