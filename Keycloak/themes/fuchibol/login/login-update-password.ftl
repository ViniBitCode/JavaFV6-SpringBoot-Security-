<#import "template.ftl" as layout>
<#import "password-commons.ftl" as passwordCommons>
<#import "field.ftl" as field>
<#import "buttons.ftl" as buttons>
<#import "password-checklist.ftl" as checklist>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
<!-- template: login-update-password.ftl -->
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post" novalidate="novalidate">
            <@field.password name="password-new" label=msg("passwordNew") fieldName="password" autocomplete="new-password" autofocus=true />
            <#-- fuchibol: lista de requisitos de contrasena, visible y marcada en vivo -->
            <@checklist.render field="password-new"/>
            <@field.password name="password-confirm" label=msg("passwordConfirm") autocomplete="new-password" />

            <div class="${properties.kcFormGroupClass!}">
                <@passwordCommons.logoutOtherSessions/>
            </div>

            <@buttons.actionGroup horizontal=true>
                <#if isAppInitiatedAction??>
                    <@buttons.button id="kc-submit" name="login" label="doSubmit"/>
                    <@buttons.button id="kc-cancel" label="doCancel" name="cancel-aia" type="secondary"/>
                <#else>
                    <@buttons.button id="kc-submit" name="login" label="doSubmit"/>
                </#if>
            </@buttons.actionGroup>
        </form>

    </#if>
</@layout.registrationLayout>
