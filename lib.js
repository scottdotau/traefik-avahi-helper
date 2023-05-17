export const labelRegExp = /traefik\.http\.routers\.(.*)\.rule/
export const hostRegExp = /Host\(\s*`(.*?\.(local|lan))`\s*,*\s*\)/gi
export const domainRegExp = /`(?<domain>[^`]*?\.(local|lan))`/g
export const matchDomainCnames = function (domainString) {
  return [...domainString.matchAll(domainRegExp)].map(match => match.groups.domain)
}