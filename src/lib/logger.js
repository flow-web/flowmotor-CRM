/**
 * Logger utilitaire — masque les logs en production.
 * En dev, proxie vers console. En prod, silencieux sauf error.
 */
const isProd = import.meta.env.PROD

const noop = () => {}

const logger = {
  log: isProd ? noop : console.log.bind(console),
  info: isProd ? noop : console.info.bind(console),
  warn: isProd ? noop : console.warn.bind(console),
  debug: isProd ? noop : console.debug.bind(console),
  error: console.error.bind(console),
}

export default logger
