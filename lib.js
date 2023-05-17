export const labelRegExp = /traefik\.http\.routers\.(.*)\.rule/
export const hostRegExp = /Host\(\s*`(.*?\.local)`\s*,*\s*\)/gi
export const domainRegExp = /`(?<domain>[^`]*?\.local)`/g
export const matchDomainCnames = function (domainString) {
  return [...domainString.matchAll(domainRegExp)].map(match => match.groups.domain)
}