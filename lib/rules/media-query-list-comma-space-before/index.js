import { createPlugin, utils, rules } from 'stylelint'

const { atRuleParamIndex, ruleMessages, validateOptions, whitespaceChecker } = utils
const { mediaQueryListCommaWhitespaceChecker } = rules

const ruleName = 'stylistic/media-query-list-comma-space-before'

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ","',
  rejectedBefore: () => 'Unexpected whitespace before ","',
  expectedBeforeSingleLine: () => 'Expected single space before "," in a single-line list',
  rejectedBeforeSingleLine: () => 'Unexpected whitespace before "," in a single-line list',
})

const meta = {
  url: 'https://github.com/elirasza/stylelint-stylistic/tree/main/lib/rules/media-query-list-comma-space-before',
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

    /** @type {Map<import('postcss').AtRule, number[]> | undefined} */
    let fixData

    mediaQueryListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (atRule, index) => {
          const paramCommaIndex = index - atRuleParamIndex(atRule)

          fixData = fixData || new Map()
          const commaIndices = fixData.get(atRule) || []

          commaIndices.push(paramCommaIndex)
          fixData.set(atRule, commaIndices)

          return true
        }
        : null,
    })

    if (fixData) {
      for (const [atRule, commaIndices] of fixData.entries()) {
        let params = atRule.raws.params ? atRule.raws.params.raw : atRule.params

        for (const index of commaIndices.sort((a, b) => b - a)) {
          const beforeComma = params.slice(0, index)
          const afterComma = params.slice(index)

          if (primary.startsWith('always')) {
            params = beforeComma.replace(/\s*$/, ' ') + afterComma
          } else if (primary.startsWith('never')) {
            params = beforeComma.replace(/\s*$/, '') + afterComma
          }
        }

        if (atRule.raws.params) {
          atRule.raws.params.raw = params
        } else {
          atRule.params = params
        }
      }
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta
export default { messages, meta, plugin: createPlugin(ruleName, rule), rule, ruleName }
