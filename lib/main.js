import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import { Plugin } from 'stylelint'

// export default readdirSync(resolve(`${__dirname}/rules`)).map((rule) => require(`./rules/${rule}`) as Plugin)
import rules from './rules'

export default rules
