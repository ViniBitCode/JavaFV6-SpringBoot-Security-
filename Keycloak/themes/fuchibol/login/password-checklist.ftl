<#--
  Lista de requisitos de contrasena, visible desde el inicio y marcada en vivo
  (resources/js/password-checklist.js). Se usa en register.ftl y en
  login-update-password.ftl:  <@checklist.render field="password"/>

  Los minimos salen de la politica de contrasenas del realm (passwordPolicies)
  cuando esta configurada; si no lo esta, se muestran los requisitos del
  producto (10 caracteres, 1 mayuscula, 1 numero, 1 caracter especial) para que
  la pantalla los comunique igual. La validacion la aplica el servidor segun la
  politica real, asi que conviene que la politica del realm coincida.
-->
<#macro render field="password">
  <#assign minLength = (passwordPolicies.length)!10>
  <#assign minUpper = (passwordPolicies.upperCase)!1>
  <#assign minDigits = (passwordPolicies.digits)!1>
  <#assign minSpecial = (passwordPolicies.specialChars)!1>
  <#assign rules = [
    { "name": "length", "value": minLength, "key": "fuchibol.passwordRules.length" },
    { "name": "upperCase", "value": minUpper, "key": "fuchibol.passwordRules.upperCase" },
    { "name": "digits", "value": minDigits, "key": "fuchibol.passwordRules.digits" },
    { "name": "specialChars", "value": minSpecial, "key": "fuchibol.passwordRules.specialChars" }
  ]>
  <ul class="fb-checklist"
      id="password-rules-${field}"
      data-password-checklist="${field}"
      data-label-met="${msg('fuchibol.passwordRules.met')}"
      data-label-pending="${msg('fuchibol.passwordRules.pending')}"
      aria-label="${msg('fuchibol.passwordRules.title')}">
    <#list rules as rule>
      <li class="fb-checklist__item" data-rule="${rule.name}" data-value="${rule.value?c}">
        <span class="fb-checklist__icon" aria-hidden="true">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5 5 9l4.5-6"/></svg>
        </span>
        <span>${msg(rule.key, rule.value?c)}</span>
        <span class="fb-visually-hidden" data-status>${msg('fuchibol.passwordRules.pending')}</span>
      </li>
    </#list>
  </ul>
  <script type="module" src="${url.resourcesPath}/js/password-checklist.js"></script>
</#macro>
