export const labelRegExp = /traefik\.http\.routers\.(.*)\.rule/
export const hostRegExp = /Host\(\s*`(.*?\.(local|lan))`\s*,*\s*\)/gi
export const domainRegExp = /`(?<domain>[^`]*?\.(local|lan))`/g
export const matchDomainCnames = function (domainString) {
  return [...domainString.matchAll(domainRegExp)].map(match => match.groups.domain)
}
export const mapTarget = t => {
  const IsSwarmService = !!t.Spec;
  const target = IsSwarmService ? t.Spec : t;
  const name = IsSwarmService ? target.Name : target.Names[0].substring(1)
  return {
    IsSwarmService,
    TargetName: name,
    ...target, 
    _original: IsSwarmService ? t : null
  } 
}