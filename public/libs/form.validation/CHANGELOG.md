# Change Log

## v0.6.2 (not released yet)

__New Features__
* Add STATUS_IGNORED status. The field will be ignored for the current validation if the validator returns null/undefined

__Improvements__
* #44: [date](http://formvalidation.io/validators/date/) validator supports dot (.) separator for European countries
* #62: Allow to use callback for field's [excluded](http://formvalidation.io/settings/#field-excluded) option

__Bug Fixes__
* #47: Spanish VAT validator doesn't work with some examples
* #48: Override the options when adding field
* #50: The Brazilian [Id](http://formvalidation.io/validators/id/) (CPF) number must have 11 digits
* The [updateMessage()](http://formvalidation.io/api/#update-message) method must return the plugin instance for chaining
* When calling [resetField(true)](http://formvalidation.io/api/#reset-field) and [resetForm(true)](http://formvalidation.io/api/#reset-form) methods, the field need be reset value before updating the status

__Document__
* #38: Add [Loading and saving data in a modal](http://formvalidation.io/examples/loading-saving-data-modal/) example
* #43: Add [Playing with Bootstrap Combobox](http://formvalidation.io/examples/bootstrap-combobox/) example
* #45: Update the [Showing card icon](http://formvalidation.io/validators/creditCard/#showing-card-icon) example
* #49: Add [Switching validators on the same field](http://formvalidation.io/examples/switching-validators-same-field/) example
* #54: Add [Playing with geocomplete](http://formvalidation.io/examples/geocomplete/) example
* Add [Conditional validation](http://formvalidation.io/examples/conditional-validation/) example
* Fix the [Clearing field when clicking the icon](http://formvalidation.io/examples/clearing-field-when-clicking-icon/) example
* Update the [iCheck](http://formvalidation.io/examples/icheck/) example to support mobile browsers

## v0.6.1 (2015-02-24)

__New Features__
* #467: Add ```dataType```, ```crossDomain```, ```validKey``` options for [remote](http://formvalidation.io/validators/remote/) validator.

It's possible to use remote validator to connect to external validator API, such as [MailGun (#1315)](https://github.com/formvalidation/formvalidation/issues/1315)

* #940: Add ```declarative``` option to support big form
* #1328, #1330: Add Netherlands [phone](http://formvalidation.io/validators/phone/) validator, thanks to [@HendrikSwBase](https://github.com/HendrikSwBase)
* #1347: Add Bulgarian [zip code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@Izopi4a](https://github.com/Izopi4a)
* #1350: Add Bulgarian [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@Izopi4a](https://github.com/Izopi4a)
* #1355: Add Polish [zip code](http://formvalidation.io/validators/zipCode/) and [id](http://formvalidation.io/validators/id/) validators, thanks to [@tjagusz](https://github.com/tjagusz)
* #1357: Support custom framework

__Improvements__
* #1327: [remote](http://formvalidation.io/validators/remote/) validator fails if Ajax request fails
* #1427: Update Netherlands [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@DiederikLascaris](https://github.com/DiederikLascaris)
* Add plugin instance to the 3rd parameter of [transformer](http://formvalidation.io/settings/#validator-transformer) callback
* Add Grunt task that runs the jasmine test suites

__Bug Fixes__

This version fixed the ```isValid()``` method which should return ```null``` when there is not validated or being validated field.
It also solves the issues where the submit button is disabled even when the form is valid.

* #962, #1318: remote validator and ```isValid()``` combined do not work
* #1160: Submit button is disabled
* #1171: Submit button being disabled
* #1220: Can only submit form after changing a value
* #1221, #1344: Remote validation trigger ```err.form.fv```
* #1394: Submit incorrectly enabled even though form has errors

Other issues are fixed in this version:
* #1107, #1279, #1280, #1419: Show the ```validating``` icon when the field is being validated
* #1282: Reset checkbox when calling [resetForm()](http://formvalidation.io/api/#reset-form) method
* #1320: Fix Slovakia [phone number](http://formvalidation.io/validators/phone/) validator
* #1343, #1369: Fix the issue where custom validator doesn't provide default message
* #1379: Don't continue if there is no validators attached to fields
* #1387: [transformer](http://formvalidation.io/settings/#validator-transformer) option doesn't work with [notEmpty](http://formvalidation.io/validators/notEmpty/) validator
* #1389: Fix ```isValidContainer()``` and ```validateContainer()``` methods to support fields with the same name

__Document__
* #673: Update [emailAddress](http://formvalidation.io/validators/emailAddress/) validator document
* #688: Add a [notice](http://formvalidation.io/settings/#form-icon) when using FontAwesome icon
* #973, #1021, #1346: 3 ways to [improve performance](http://formvalidation.io/validators/remote/#improving-the-performance) when using remote validator
* #1098, #1118, #1325: Add [Playing with Fuel UX Wizard](http://formvalidation.io/examples/fuel-ux-wizard/) example
* #1109, #1326: Add [Playing with Typehead](http://formvalidation.io/examples/typeahead/) example
* #1112: Support thousand separator
* #1124, #1329: Fix [CKEditor example](http://formvalidation.io/examples/ckeditor/) on Firefox
* #1205: Add [Playing with Bootstrap Material Design](http://formvalidation.io/examples/bootstrap-material-design/) example
* #1308: Update [Showing card icon](http://formvalidation.io/validators/creditCard/#showing-card-icon) example
* #1313: Add [Adding warning validation state](http://formvalidation.io/examples/adding-warning-validation-state/) example
* #1315: Add [Using Mailgun API to validate email address](http://formvalidation.io/examples/using-mailgun-api-validate-email-address/) example
* #1333: Update [Enabling the submit button](http://formvalidation.io/examples/enabling-submit-button/) example
* #1378: Add [Validating multiple inputs as one](http://formvalidation.io/examples/validating-multiple-inputs-one/) example
* #1388: Add [Field value is changed programmatically](http://formvalidation.io/examples/field-value-changed-programmatically/) example
* #1390: Fix the [isValid()](http://formvalidation.io/api/#is-valid) method document
* #1397: Add [Updating validator options](http://formvalidation.io/examples/updating-validator-options/) example
* #1423: Update the [UIKit icon usage](http://formvalidation.io/settings/#form-icon)
* formvalidation/formvalidation.io#11: Fix the issue in [Settings Structure](http://formvalidation.io/settings/#settings-structure) section, thanks to [@DiederikLascaris](https://github.com/DiederikLascaris)
* formvalidation/support#29: Add [Playing with jQuery UI Datepicker](http://formvalidation.io/examples/jquery-ui-datepicker/) example
* formvalidation/support#33: Add [Playing with Flat UI](http://formvalidation.io/examples/flat-ui/) example
* formvalidation/support#37: Add [Showing all messages when using callback validator](http://formvalidation.io/validators/callback/#showing-all-messages) example

__Language Packages__
* #1381: Update Slovak language package, thanks to [@PatrikGallik](https://github.com/PatrikGallik)
* #1400: Update Belgian Dutch language package, thanks to [@jdt](https://github.com/jdt)
* #1432: Fix some typos in the Hungarian translation, thanks to [@blackfyre](https://github.com/blackfyre)

## v0.6.0 (2015-01-06)

__New Features__
* #708, #899: Add ```setLocale()``` and ```getLocale()``` methods to support multiple languages
* #718: Add ```validateContainer()``` method
* #744: Add [transformer](http://formvalidation.io/settings/#validator-transformer) option, allowing to hook the value of field before validating
* #1131: Support add-on
* #1140: Add UAE [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@s-a-y](https://github.com/s-a-y)
* #1153: Add EIN validator, thanks to [@joshuachestang](https://github.com/joshuachestang)
* #1165: Add BIC (ISO 9362) validator, thanks to [@thomaslhotta](https://github.com/thomaslhotta)
* #1185: Add ```composer.json``` file, thanks to [@rbnvrw](https://github.com/rbnvrw)
* #1189, #1194: Add ```err```, ```icon```, ```row``` options
* #1204: __Support Zurb Foundation framework__
* #1207: Add Spanish [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@ethernet-zero](https://github.com/ethernet-zero)
* #1208: Support Spanish [CIF](http://formvalidation.io/validators/id/) validator, thanks to [@ethernet-zero](https://github.com/ethernet-zero)
* #1210: __Support UI Kit framework__
* #1211: __Support Semantic UI framework__
* #1212: __Support Pure framework__
* #1227, #1229: Add India [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@waveking](https://github.com/waveking)
* #1230, #1231: Add India [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@waveking](https://github.com/waveking)

__Changes__
* #1167: Remove hexColor validator. Use [color](http://formvalidation.io/validators/color/) validator instead
* #1272: Change event ```error.x.x``` to ```err.x.x``` to avoid ```window.onerror``` being invoked by jQuery
* Remove tab behavior from base class

__Add-ons__
* #1116: Showing only one message each time
* #1126: Required icon
* #1132: Google reCAPTCHA add-on
* multilingual add-on

__Improvements__
* #883: Look for the field inside form first when using selector, thanks to [@drebrez](https://github.com/drebrez)
* #908, #1156: Add option to set optional protocol in [uri](http://formvalidation.io/validators/uri/) validator, thanks to [@krecik](https://github.com/krecik)
* #914, #1035, #1163: Improve [identical](http://formvalidation.io/validators/identical/) validator, thanks to [@jazzzz](https://github.com/jazzzz)
* #1037: Show the credit card icon based on its type
* #1083, [#1092](https://github.com/formvalidation/formvalidation/pull/1092/): Showing tooltip/popover when moving over or clicking the feedback icon (Bootstrap 3.3.0), thanks to [@Arkni](https://github.com/Arkni)
* #1137: Use ```jQuery``` instead of ```window.jQuery```
* #1154: Allow to reuse data which is returned by the validator
* #1177: Don't need to set the [different](http://formvalidation.io/validators/different/) validator for both fields
* #1186, #1188: Improve the [CPF](http://formvalidation.io/validators/id/) validator, thanks to [@igorescobar](https://github.com/igorescobar)
* #1197: Add sample data for [CPF](http://formvalidation.io/validators/id/) validator, thanks to [@dgmike](https://github.com/dgmike)
* #1207: Improve Spanish [phone](http://formvalidation.io/validators/phone/) validator, thanks to [@ethernet-zero](https://github.com/ethernet-zero)
* #1218: Improve Slovenian [vat number](http://formvalidation.io/validators/vat/) validator, thanks to [@Glavic](https://github.com/Glavic)
* #1224: Improve tooltip style when working with Semantic UI form, thanks to [@Arkni](https://github.com/Arkni)
* #1226: Fix destroying Semantic UI popup, thanks to [@Arkni](https://github.com/Arkni)
* #1239: Fix typo in UIKit class, thanks to [@Arkni](https://github.com/Arkni)
* #1252: Validators return true for not supported countries
* #1255, #1258: Support to use a Date object as value for ```min``` and ```max``` options, thanks to [@Arkni](https://github.com/Arkni)
* #1261: Improve [cvv](http://formvalidation.io/validators/cvv/) validator
* #1268: [uri](http://formvalidation.io/validators/uri/) validator gets slower if more than 25 characters
* The ```isValidContainer()``` method should return ```null``` if the container consists of at least one field which is not validated yet or being validated

__Bug Fixes__
* #1101: The [cusip](http://formvalidation.io/validators/cusip/) validator doesn't work
* #1102: Fix the [date](http://formvalidation.io/validators/date/) validator issue where accepts ```2014-11-1 23:``` as valid ```YYYY-MM-DD h:m``` date
* #1105: The [color](http://formvalidation.io/validators/color/) validator doesn't provide ```html5Attributes``` mapping
* #1125, #1136: Update Brazil [ID](http://formvalidation.io/validators/id/) validator to support working with Mask plugin, thanks to [@jonasesteves](https://github.com/jonasesteves)
* #1243: Fix the icon without label class
* #1267: [identical](http://formvalidation.io/validators/identical/) validator allows to compare with any input
* #1274: Fix ```validateContainer()``` to use map value instead of key, thanks to [@jasonblalock](https://github.com/jasonblalock)
* #1279, #1280: Show the ```validating``` icon when the field is being validated, thanks to [@tmaly1980](https://github.com/tmaly1980)
* #1292: Fix bug of US [phone number](http://formvalidation.io/validators/phone/) validator

__Document__
* #800: Add [Using uri and regexp validators](http://formvalidation.io/validators/uri/#using-with-regexp-validator) example
* #825: Add [Bootstrap Datepicker](http://formvalidation.io/examples/bootstrap-datepicker/) example
* #919, #1114: Add [Google reCAPTCHA](http://formvalidation.io/examples/validating-google-recaptcha/) example
* #941: Add [Clearing field when clicking the icon](http://formvalidation.io/examples/clearing-field-when-clicking-icon/) example
* #948, #978, #1032, #1146, #1162: Add the [Is a@b valid email address](http://formvalidation.io/validators/emailAddress/#is-ab-valid-email-address) section
* #1034: Add [Only enable the submit button if all fields are valid](http://formvalidation.io/examples/enabling-submit-button/) example
* #1078, #1104: Update the [Enabling the submit button all the time](http://formvalidation.io/examples/enabling-submit-button/) example
* #1106: Add example to the [phone](http://formvalidation.io/validators/phone/) validator
* #1122: Add third parameter to ```callback``` method of [callback](http://formvalidation.io/validators/callback/) validator, thanks to [@Arkni](https://github.com/Arkni)
* #1128: Add link to the [Examples](http://formvalidation.io/examples/) from the [homepage](http://formvalidation.io/#2)
* #1139: Add sample [United Arab Emirates phone numbers](http://formvalidation.io/validators/phone/), thanks to [@s-a-y](https://github.com/s-a-y)
* #1143, #1176: Add [Form is submitted twice](http://formvalidation.io/examples/form-submit-twice/) example
* #1172: Add [Requiring at least one field](http://formvalidation.io/examples/requiring-at-least-one-field/) example
* #1174: Add [Pickadate](http://formvalidation.io/examples/pickadate/) example
* #1187: Add sample [Brazil ID (CPF) numbers](http://formvalidation.io/validators/id/), thanks to [@igorescobar](https://github.com/igorescobar)
* #1233: Add sample [India postal code numbers](http://formvalidation.io/validators/zipCode/), thanks to [@waveking](https://github.com/waveking)

__Language Packages__
* #1150: Add Catalan language package, thanks to [@ArnauAregall](https://github.com/ArnauAregall)
* #1216, #1248: Add Slovak language package, thanks to [@budik21](https://github.com/budik21)
* #1217, #1247: Update Czech language package, thanks to [@budik21](https://github.com/budik21)
* #1225: Add Finnish language package, thanks to [@traone](https://github.com/traone)
* #1246: Add Hindi language package, thanks to [@gladiatorAsh](https://github.com/gladiatorAsh)
* #1321: Add Basque language package, thanks to [@xabikip](https://github.com/xabikip)

## v0.5.3 (2014-11-05)

__New Features__
* #807, #821: Add ```min```, ```max``` options for the [date](http://formvalidation.io/validators/date/) validator, thanks to [@Arkni](https://github.com/Arkni)
* #822: Add [color](http://formvalidation.io/validators/color/) validator, thanks to [@emilchristensen](https://github.com/emilchristensen)
* #844, #874: The [stringLength](http://formvalidation.io/validators/stringLength/) validator adds option to evaluate length in UTF-8 bytes, thanks to [@thx2001r](https://github.com/thx2001r)
* #937, #1001: Add ```minFiles```, ```maxFiles```, ```minTotalSize```, ```maxTotalSize``` options for the [file](http://formvalidation.io/validators/file/) validator, thanks to [@morrizon](https://github.com/morrizon)
* #960, #1052: Add ```trim``` option for the [stringLength](http://formvalidation.io/validators/stringLength/) validator
* #1008: Add France [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@jazzzz](https://github.com/jazzzz)
* #1010: Add Ireland [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@zmira](https://github.com/zmira)
* #1018: Add German [phone number](http://formvalidation.io/validators/phone/) and [postal code](http://formvalidation.io/validators/zipCode/) validators, thanks to [@jhadenfeldt](https://github.com/jhadenfeldt)
* #1022: Add Portugal [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@zmira](https://github.com/zmira)
* #1033, #1043, #1068: Add ```autoFocus``` option
* #1072: Add Austria and Switzerland [postal code](http://formvalidation.io/validators/zipCode/) validators, thanks to [@thomaslhotta](https://github.com/thomaslhotta)

__Improvements__
* #823: The [hexColor](http://formvalidation.io/validators/color/) validator only accepts 6 hex character values when using HTML 5 ```type='color'``` attribute
* #864: Comma separator handling in [greaterThan](http://formvalidation.io/validators/greaterThan/), [lessThan](http://formvalidation.io/validators/lessThan/) validators, thanks to [@mgibas](https://github.com/mgibas)
* #999, #1048: Replace ',' with '.' to validate decimal numbers correct, thanks to [@johanronn77](https://github.com/johanronn77)
* #1002: Put tooltip/popover on bottom if there is not enough space on top, thanks to [@jazzzz](https://github.com/jazzzz)
* #1015: The [remote](http://formvalidation.io/validators/remote/) validator allows to set ```data``` options via HTML attributes, thanks to [@jazzzz](https://github.com/jazzzz)
* #1017: Enable validator when setting ```data-bv-validatorname="data-bv-validatorname"```, thanks to [@jazzzz](https://github.com/jazzzz)
* #1026: Requires jQuery 1.9.1 or higher

__Bug Fixes__
* #343, #481, #1045: Fix double submit with defered validators, thanks to [@jazzzz](https://github.com/jazzzz)
* #933, #959, #1047: Tooltip/popover isn't destroyed when the field is valid
* #991: The field is validated only one time when setting ```trigger: 'blur'```, ```container: 'tooltip'```
* #1014: Fix [isValidField()](http://formvalidation.io/api/#is-valid-field) and [validateField()](http://formvalidation.io/api/#validate-field) methods for fields without validators, thanks to [@jazzzz](https://github.com/jazzzz)
* #1050: Fix the issue when using multiple fields with same name, the tooltip of the last element is always shown
* #1055, #1063: The [error.field.bv](http://formvalidation.io/settings/#event-field) event isn't triggered if verbose is set to false, thanks to [@shineability](https://github.com/shineability)
* #1057, #1063: The [verbose](http://formvalidation.io/settings/#field-verbose) option for field doesn't override the form level, thanks to [@shineability](https://github.com/shineability)

__Document__
* #848: Update the [stringLength](http://formvalidation.io/validators/stringLength) document, thanks to [@Relequestual](https://github.com/Relequestual)
* #885: Add a notification about setting [identical](http://formvalidation.io/validators/identical/) validator for both fields
* #912: Add [Using language package](http://formvalidation.io/examples/using-language-package/) example
* #920, #929, #936: Update the [Changing the tooltip, popover's position](http://formvalidation.io/examples/tooltip-popover-position/) example, thanks to [@Arkni](https://github.com/Arkni)
* #938: Add [time](http://formvalidation.io/validators/regexp/#html-5-example) validator example
* #979: Add [Rails usage](http://formvalidation.io/validators/stringLength/#using-with-rails-form) for [stringLength](http://formvalidation.io/validators/stringLength/) validator
* #1006: Fix the order of [parameters](http://formvalidation.io/settings/#validator-enabled) for [enableFieldValidators()](http://formvalidation.io/api/#enable-field-validators) method, thanks to [@mchrapka](https://github.com/mchrapka)
* #1009: Fix mixed data/delay in [remote](http://formvalidation.io/validators/remote/) doc, thanks to [@jazzzz](https://github.com/jazzzz)
* #1019: Updated docs for added German [postal code](http://formvalidation.io/validators/zipCode/) and [phone number](http://formvalidation.io/validators/phone/) validators, thanks to [@jhadenfeldt](https://github.com/jhadenfeldt)
* #1038: Fix [Changing tooltip, popover's position](http://formvalidation.io/examples/changing-tooltip-position/) example link, thanks to [@Arkni](https://github.com/Arkni)

__Language Packages__
* #827: Update Dutch language package, thanks to [@JvanderHeide](https://github.com/JvanderHeide)
* #829: Update Swedish language package, thanks to [@ulsa](https://github.com/ulsa)
* #834: Update Ukrainian and Russian language packages, thanks to [@oleg-voloshyn](https://github.com/oleg-voloshyn)
* #835: Update Belgium (French) language package, thanks to [@neilime](https://github.com/neilime)
* #836: Update French language package, thanks to [@neilime](https://github.com/neilime)
* #837: Update Bulgarian language package, thanks to [@mraiur](https://github.com/mraiur)
* #846: Update simplified Chinese language package, thanks to [@shamiao](https://github.com/shamiao)
* #849: Update Serbian language package, thanks to [@markocrni](https://github.com/markocrni)
* #850, #851: Update Danish language package, thanks to [@Djarnis](https://github.com/Djarnis)
* #869: Update Polish language package, thanks to [@grzesiek](https://github.com/grzesiek)
* #870: Update Traditional Chinese language package, thanks to [@tureki](https://github.com/tureki)
* #871: Update Czech language package, thanks to [@cuchac](https://github.com/cuchac)
* #872: Update Indonesian language package, thanks to [@egig](https://github.com/egig)
* #879: Update Romanian language package, thanks to [@filipac](https://github.com/filipac)
* #880: Update Belgium (Dutch) language package, thanks to [@dokterpasta](https://github.com/dokterpasta)
* #881: Update Italian language package, thanks to [@maramazza](https://github.com/maramazza)
* #882: Update Spanish language package, thanks to [@vadail](https://github.com/vadail)
* #891: Update Portuguese (Brazil) language package, thanks to [@dgmike](https://github.com/dgmike)
* #893: Fix country name of Dominican Republic, thanks to [@sventech](https://github.com/sventech)
* #900: Update Persian (Farsi) language package, thanks to [@i0](https://github.com/i0)
* #903: Update Hungarian language package, thanks to [@blackfyre](https://github.com/blackfyre)
* #910: Update Greek language package, thanks to [@pRieStaKos](https://github.com/pRieStaKos)
* #913: Update Thai language package, thanks to [@figgaro](https://github.com/figgaro)
* #915: Update Turkish language package, thanks to [@CeRBeR666](https://github.com/CeRBeR666)
* #961: Update Chilean Spanish language package, thanks to [@marceloampuerop6](https://github.com/marceloampuerop6)
* #967: Add Hebrew language package, thanks to [@yakidahan](https://github.com/yakidahan)
* #974: Add Albanian language package, thanks to [@desaretiuss](https://github.com/desaretiuss)
* #1025: Fix French emailAddress message, thanks to [@jazzzz](https://github.com/jazzzz)
* #1051: Add Portuguese language package, thanks to [@rtbfreitas](https://github.com/rtbfreitas)

## v0.5.2 (2014-09-25)

__New Features__
* #480: Add ```verbose``` option, thanks to [@mbezhanov](https://github.com/mbezhanov)
* #542, #666: Add blank validator, thanks to [@bermo](https://github.com/bermo)
* #617: Add ```init``` and ```destroy``` methods to validator
* #724: Add Venezuelan VAT number (RIF) validator, thanks to [@paquitodev](https://github.com/paquitodev)
* #739: Add China phone number validator, thanks to [@caijh](https://github.com/caijh)
* #743: Add Venezuela phone number validator, thanks to [@paquitodev](https://github.com/paquitodev)
* #760: Add Romania phone number validator, thanks to [@adrian-dks](https://github.com/adrian-dks)
* #761: Add Romania postal code validator, thanks to [@adrian-dks](https://github.com/adrian-dks)
* #785: Add Denmark phone number validator, thanks to [@emilchristensen](https://github.com/emilchristensen)
* #787: Add Thailand phone number and ID validator, thanks to [@figgaro](https://github.com/figgaro)
* #793, #798: Add Chinese citizen ID validator, thanks to [@shamiao](https://github.com/shamiao)
* #802: Add Russia phone number validator, thanks to [@cylon-v](https://github.com/cylon-v). #816: Improved by [@stepin](https://github.com/stepin)
* #816: Add Russian postal code validator, thanks to [@stepin](https://github.com/stepin)
* #867: Add Czech and Slovakia phone number and postal code validators, thanks to [@cuchac](https://github.com/cuchac)

__Changes__
* #753: Change the default type of [remote](http://formvalidation.io/validators/remote/) validator to GET

__Improvements__
* #249, #574, #669: Add ```delay``` option to the [remote](http://formvalidation.io/validators/remote/) validator, thanks to [@q-state](https://github.com/q-state)
* #345, #454: The [different](http://formvalidation.io/validators/different/) validator allows more than a 2-way comparison, thanks to [@AlaskanShade](https://github.com/AlaskanShade)
* #557, #569: The [container](http://formvalidation.io/settings/#form-container) option can be defined by a callback, thanks to [@mattrick](https://github.com/mattrick)
* #570: Use CSS classes instead of inline styling to fix icons with ```input-group```, thanks to [@dlcrush](https://github.com/dlcrush)
* #578, #813: The [stringLength](http://formvalidation.io/validators/stringLength/) validator supports HTML 5 ```minlength``` attribute, thanks to [@emilchristensen](https://github.com/emilchristensen)
* #675: The [emailAddress](http://formvalidation.io/validators/emailAddress/) validator accepts multiple email addresses, thanks to [@kenny-evitt](https://github.com/kenny-evitt)
* #716, #765: Reuse data returned by [callback](http://formvalidation.io/validators/callback/), [remote](http://formvalidation.io/validators/remote/), custom validators
* #734: The [uri](http://formvalidation.io/validators/uri/) validator adds support for custom protocol, thanks to [@bcamarneiro](https://github.com/bcamarneiro)
* #737: Support VAT number without prefixing by country code
* #754: Support latest Bootstrap when using tooltip/popover to show the message
* #783: Improve behaviour of the [different](http://formvalidation.io/validators/different/) validator
* #792: Add "BootstrapValidator's JavaScript requires jQuery" warning, thanks to [@Arkni](https://github.com/Arkni)
* #803: Add ```minSize``` option for the [file](http://formvalidation.io/validators/file/) validator, thanks to [@Arkni](https://github.com/Arkni)
* #824: Add [phone](http://formvalidation.io/validators/phone/) number validator test suite

__Bug Fixes__
* #611, #703: Tabs get red even form is valid
* #612, #740, #741: Fix the [emailAddress](http://formvalidation.io/validators/emailAddress/) issue which email@server is not valid email address, thanks to [@kromit](https://github.com/kromit)
* #687, #711: Keep disabled validators VALID, thanks to [@talberti](https://github.com/talberti)
* #725: Fix the issue when adding field which does not exist but is already set in "fields" option
* #732: Fix the issue when removing the radio or checkbox field
* #746, #922: The form is still submitted when clicking on submit button which is set ```onclick="return false;"```
* #758: Using [notEmpty](http://formvalidation.io/validators/notEmpty/) validator with ```type="number"```
* #759, #764: The tooltip/popover isn't shown if there is disabled validator.
The tooltip/popover is shown automatically when the field gets the focus, thanks to [@leedorian](https://github.com/leedorian)
* #797, #799: Can't validate ipv4 and ipv6 at the same time. Add ip validator test suite, thanks to [@Arkni](https://github.com/Arkni)
* #816: Fix Russian [VAT](http://formvalidation.io/validators/vat/) number validator, thanks to [@stepin](https://github.com/stepin)
* #832: The form won't be validated if the submit button contains a HTML tag

__Document__
* #709, #715: Add [Bootstrap Select](http://formvalidation.io/examples/bootstrap-select/) and [Select2](http://formvalidation.io/examples/select2/) examples, thanks to [@Arkni](https://github.com/Arkni)
* #855, #858: Add [TinyMCE](http://formvalidation.io/examples/tinymce/) example, thanks to [@Arkni](https://github.com/Arkni)
* #859, #862, #865: Add [Changing tooltip/popover position](http://formvalidation.io/examples/tooltip-popover-position/) example, thanks to [@Arkni](https://github.com/Arkni)

__Language Packages__
* #706: Japanese language package, thanks to [@tsuyoshifujii](https://github.com/tsuyoshifujii)
* #712: Swedish language package, thanks to [@ulsa](https://github.com/ulsa)
* #727: Belgium (French) language package, thanks to [@neilime](https://github.com/neilime)
* #729: Persian (Farsi) language package, thanks to [@i0](https://github.com/i0)
* #779: Romanian language package, thanks to [@filipac](https://github.com/filipac)
* #787: Thai language package, thanks to [@figgaro](https://github.com/figgaro)
* #788: Fully re-translated Simplified Chinese language package, thanks to [@shamiao](https://github.com/shamiao)
* #795: Re-translated traditional Chinese language package, thanks to [@tureki](https://github.com/tureki)
* #802: Russian language package, thanks to [@cylon-v](https://github.com/cylon-v). #816: Improved by [@stepin](https://github.com/stepin)
* #806: Ukrainian language package, thanks to [@oleg-voloshyn](https://github.com/oleg-voloshyn)
* #840: Serbian language package, thanks to [@markocrni](https://github.com/markocrni)
* #856: Norwegian language package, thanks to [@trondulseth](https://github.com/trondulseth)
* #868: Indonesian language package, thanks to [@egig](https://github.com/egig)

## v0.5.1 (2014-08-22)

__New Features__
* #218, #531: Add meid validator, thanks to [@troymccabe](https://github.com/troymccabe)
* #267, #532: Add imo validator, thanks to [@troymccabe](https://github.com/troymccabe)
* #510, #646: Add French [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@dlucazeau](https://github.com/dlucazeau)
* #536: Add Spanish [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@vadail](https://github.com/vadail)
* #519: Add Iceland [VAT](http://formvalidation.io/validators/vat/) number validator, thanks to [@evilchili](https://github.com/evilchili)
* #620, #621: Add Pakistan [phone number](http://formvalidation.io/validators/phone/) validator, thanks to [@abuzer](https://github.com/abuzer)
* #630, #640: Add event name options to avoid ```window.onerror``` being invoked by jQuery, thanks to [@roryprimrose](https://github.com/roryprimrose). Thanks to [@stephengreentree](https://github.com/stephengreentree) for creating the test suite (#657)
* #637: Add South African [VAT](http://formvalidation.io/validators/vat/) number validator, thanks to [@evilchili](https://github.com/evilchili)
* #638, #647: Add Brazilian [phone number](http://formvalidation.io/validators/phone/) and [postal code](http://formvalidation.io/validators/zipCode/) validator, thanks to [@fhferreira](https://github.com/fhferreira)
* #643: Add [zipCode](http://formvalidation.io/validators/zipCode/) and [phone number](http://formvalidation.io/validators/phone/) validators for Morocco, thanks to [@Arkni](https://github.com/Arkni)
* #650: Add Brazilian [VAT](http://formvalidation.io/validators/vat/) number validator, thanks to [@fhferreira](https://github.com/fhferreira)

__Improvements__
* #502: Allowing sites without TLD to pass URI validation, thanks to [@troymccabe](https://github.com/troymccabe)
* #549, #600: Change the CSS/JS path in ```demo/remote.html``` and ```demo/message.html```, thanks to [@leegtang](https://github.com/leegtang), [@Arkni](https://github.com/Arkni)
* #604: Fix the ```demo/date.html``` and ```demo/tab.html``` examples, thanks to [@Arkni](https://github.com/Arkni)
* #609: Add content-type header for ```demo/remote.php```, thanks to [@etorres](https://github.com/etorres)
* #661: Add ```headers``` option to the [remote](http://formvalidation.io/validators/remote/) validator, thanks to [@ryan2049](https://github.com/ryan2049)
* #664: Fix the feedback icon position for Bootstrap 3.2
* #683: Force the format option to be ```YYYY-MM-DD``` when using ```<input type="date" />```
* #698: Ignore type checking if the file type is empty

__Bug Fixes__
* #284, #294, #441, #516, #580: The HTML 5 ```<input type="number" />``` input allows to input non-digits characters
* #548: Fix the issue when using [different](http://formvalidation.io/validators/different/) validator to compare with not existing field
* #550, #551: Cannot validate against both ipv4 and ipv6 at the same time, thanks to [@beeglebug](https://github.com/beeglebug)
* #588: Don't use min, max attributes (greaterThan, lessThan validators) for ```<input type="date" />```
* #665: The [submitButtons](http://formvalidation.io/settings/#form-submit-buttons) option doesn't work correctly
* #672: The [zipCode](http://formvalidation.io/validators/zipCode/) validator throw an exception when passing not supported country code
* #681: Fix the [date](http://formvalidation.io/validators/date/) validator issue where one of date/month/year or hours/minutes/seconds is prefixed by zero
* #692: The [remote](http://formvalidation.io/validators/remote/) validator can't set the type option via HTML attribute
* #700: The [between](http://formvalidation.io/validators/between/), [greaterThan](http://formvalidation.io/validators/greaterThan/), [lessThan](http://formvalidation.io/validators/lessThan/) validators accept param which isn't number

__Language Packages__
* #400: Italian language package, thanks to [@maramazza](https://github.com/maramazza)
* #503: French language package, thanks to [@dlucazeau](https://github.com/dlucazeau)
* #505: Czech language package, thanks to [@AdwinTrave](https://github.com/AdwinTrave)
* #507: Polish language package, thanks to [@grzesiek](https://github.com/grzesiek). #624: Typos fixed by [@lukaszbanasiak](https://github.com/lukaszbanasiak)
* #517: Belgium (Dutch) language package, thanks to [@dokterpasta](https://github.com/dokterpasta)
* #527: Bulgarian language package, thanks to [@mraiur](https://github.com/mraiur)
* #534: Turkish language package, thanks to [@CeRBeR666](https://github.com/CeRBeR666)
* #536: Spanish language package, thanks to [@vadail](https://github.com/vadail)
* #544: Greek language package, thanks to [@pRieStaKos](https://github.com/pRieStaKos)
* #545: Portuguese (Brazil) language package, thanks to [@marcuscarvalho6](https://github.com/marcuscarvalho6)
* #598: Danish language package, thanks to [@Djarnis](https://github.com/Djarnis)
* #674, #677: Dutch language package, thanks to [@jvanderheide](https://github.com/jvanderheide)
* #679: Add Arabic language package, thanks to [@Arkni](https://github.com/Arkni)

## v0.5.0 (2014-07-14)

__New Features__
* #2, #387: Provide the default error messages
* #93, #385: Support translating error messages. Provide the Vietnamese language file
* #121: Add events for form validate successfully or not
* #125: Support dynamic fields
* #130: Add ```addField()``` and ```removeField()``` methods for managing dynamic fields, thanks to [@jcnmulio](https://github.com/jcnmulio)
* #164: Add ```container``` option for indicating the element showing all errors
* #175: Showing errors in tooltip or popover
* #195: Add events for field validation
* #211, #235: Add new method ```getInvalidFields()``` that returns all invalid fields
* #275: Add ```destroy()``` method
* #282, #347: Use error message that is returned from [callback](http://formvalidation.io/validators/callback/), [remote](http://formvalidation.io/validators/remote/) validators
* Add ```status.field.bv``` event which is triggered after updating the field status. It can be used to solve #300, #301
* #316: Add ```isValidContainer(container)``` method
* #320: Add ```separator``` option to the [date validator](http://formvalidation.io/validators/date/)
* #323: Add ```isValidField(field)``` method
* #324: Add ```success.validator.bv``` and ```error.validator.bv``` events triggered after a validator completes
* #332: Add UK phone number support for the [phone validator](http://formvalidation.io/validators/phone/), thanks to [@aca02djr](https://github.com/aca02djr)
* #336: Add ```$field``` instance to the [callback validator](http://formvalidation.io/validators/callback/)
* #356: Add ```group``` option
* #374: Add Singapore postal code to the [zipCode validator](http://formvalidation.io/validators/zipCode/), thanks to [@thisisclement](https://github.com/thisisclement)
* #406: Add ```revalidateField(field)``` method
* #433: Add ```resetField(field, resetValue)``` method
* #434: Add ```updateMessage(field, validator, message)``` method

__Changes__
* #42: Remove the submit button from ```submitHandler()```. You can use new ```getSubmitButton()``` method to get the clicked submit button
* #109: Remove the ```setLiveMode()``` method
* ```FormValidator.Helper``` renames ```mod_11_10``` to ```mod11And10```, ```mod_37_36``` to ```mod37And36```
* Remove ```submitHandler()``` option. Use ```success.form.bv``` event instead:

_v0.4.5 and earlier versions_
```javascript
$(form).bootstrapValidator({
    submitHandler: function(form, validator, submitButton) {
        ...
    }
});
```

_v0.5.0_
Using ```success.form.bv``` event:

```javascript
$(form)
    .bootstrapValidator(options)
    .on('success.form.bv', function(e) {
        // Prevent form submission
        e.preventDefault();

        var $form        = $(e.target),
            validator    = $form.data('bootstrapValidator'),
            submitButton = validator.getSubmitButton();

        // Do whatever you want here ...
    });
```

__Improvements__
* #244: Only enable the submit buttons if all fields are valid, thanks to [@smeagol74](https://github.com/smeagol74)
* #262: Improve the [```updateStatus()``` method](http://formvalidation.io/api/#update-status). The plugin now doesn't show the errors, feedback icons of given field if there are uncompleted validators
* #274: Fix feedback icons in ```input-group```, thanks to [@tiagofontella](https://github.com/tiagofontella)
* #287, #291: Only send the submit button which is clicked. It's an enhancement for #238
* #297: Disable feedback icons for particular fields
* #348: The [uri validator](http://formvalidation.io/validators/uri/) now provides an option to support private/local network address
* #364: Clicking the feedback icon also effect to the checkbox, radio fields
* #366: Don't change the enable setting when the new one is the same
* #371: Add H character to the Canadian postcode, thanks to [@jzhang6](https://github.com/jzhang6)
* #382: Add JSHint to Grunt build
* #388: Allow to override the default options. Useful for using multiple forms in the same page
* #393: The [remote validator](http://formvalidation.io/validators/remote/) adds support for dynamic ```url``` and method type (GET/POST), thanks to [@ericnakagawa](https://github.com/ericnakagawa)
* #416, #448: Add ```updateOption()``` method for updating the particular validator option, thanks to [@AlaskanShade](https://github.com/AlaskanShade)
* #420: Enable/disable particular validator
* #422: Exclude particular field by ```excluded``` option or ```data-bv-excluded``` attribute
* #426: Add test suite
* #430: [between](http://formvalidation.io/validators/between/), [greaterThan](http://formvalidation.io/validators/greaterThan/), [lessThan](http://formvalidation.io/validators/lessThan/) add support for comparing to other field, return value of a callback function
* #431: Add built time to the build file
* #432: Define the callback via ```data-bv-callback-callback``` attribute
* #447: [zipCode validator](http://formvalidation.io/validators/zipCode/) allow to set the country code via another field or callback, thanks to [@AlaskanShade](https://github.com/AlaskanShade)
* #451: Validation of numeric fields with decimal steps, thanks to [@Azuka](https://github.com/Azuka)
* #456: Adjust the feedback icon position for ```.input-group``` element
* #465: Support dynamic message

__Bug Fixes__
* #288: Fix [date validator](http://formvalidation.io/validators/date/) issue on IE8
* #292: Fix identical validator issue with not clearing ```has-error``` class, thanks to [@alavers](https://github.com/alavers)
* #305, #306, #307: Fix ```inclusive``` option in the [between](http://formvalidation.io/validators/between/), [greaterThan](http://formvalidation.io/validators/greaterThan/) and [lessThan](http://formvalidation.io/validators/lessThan/) validators, thanks to [@johanronn77](https://github.com/johanronn77)
* #310, #475: The [date validator](http://formvalidation.io/validators/date/) still return valid if the value doesn't contain digits
* #311: file validation extension is case sensitive
* #312: Fix broacast typo in the [uri validator](http://formvalidation.io/validators/uri/), thanks to [@mrpollo](https://github.com/mrpollo)
* #313: Fix the [file validator](http://formvalidation.io/validators/file/) issue on IE 8
* #314: The [creditCard validator](http://formvalidation.io/validators/creditCard/) doesn't work on IE 8
* #315: The [cvv validator](http://formvalidation.io/validators/cvv/) doesn't work on IE 8
* #325: The [```threshold``` option](http://formvalidation.io/settings/#threshold) doesn't work on IE 8
* #358: The [zipCode validator](http://formvalidation.io/validators/zipCode/) doesn't work for Canadian zip code
* #375: Don't submit form when the [callback validator](http://formvalidation.io/validators/callback/) completes and the submit button isn't clicked
* #377: The [id](http://formvalidation.io/validators/id/), [vat](http://formvalidation.io/validators/vat/) validators should return ```false``` if the country code is not supported
* #389: When using multiple forms with HTML attributes on the same page, the plugin options will be the same as the last one
* #401: [stringLength validator](http://formvalidation.io/validators/stringLength/) allows spaces after max length
* #411: Fix the [ean validator](http://formvalidation.io/validators/ean/) when the check digit is zero, thanks to [@manish-in-java](https://github.com/manish-in-java)
* #417: IPv6 validator doesn't work
* #425: Custom trigger event is ignored by field validators
* #447: Skip the ```_isExcluded()``` when initializing the form. This fixes #269, #273. Thanks to [@AlaskanShade](https://github.com/AlaskanShade)
* #483, #487: Added the letters 'W' and 'Z' in the second and third letter list for Canada postal code, thanks to [@jzhang6](https://github.com/jzhang6)
* #492, #493: Fixed Chilean ID (RUT/RUN) finished in 'K' or 'k', thanks to [@marceloampuerop6](https://github.com/marceloampuerop6)

__Document__
* #259: Typo "Support almost Bootstrap forms", thanks to [@lloydde](https://github.com/lloydde)
* #261: English fix to 'amazing contributors' section, thanks to [@lloydde](https://github.com/lloydde)
* #278: Update the [choice validator](http://formvalidation.io/validators/choice/) document, thanks to [@MrC0mm0n](https://github.com/MrC0mm0n)
* #303: Fix typo in [remote validator](http://formvalidation.io/validators/remote/) document, thanks to [@MartinDevillers](https://github.com/MartinDevillers)
* #334: No ID is specified on the form object for registration, thanks to [@jjshoe](https://github.com/jjshoe)
* #423: Add default column to settings table, thanks to [@MartinDevillers](https://github.com/MartinDevillers)
* #452: Update 'United State' to 'United States', thanks to [@mike1e](https://github.com/mike1e)

__Language Packages__
* #396: German language package, thanks to [@logemann](https://github.com/logemann)
* #474: Hungarian language package, thanks to [@blackfyre](https://github.com/blackfyre)
* #478: Simplified and traditional Chinese language package, thanks to [@tureki](https://github.com/tureki)
* #494: Chilean Spanish language package, thanks to [@marceloampuerop6](https://github.com/marceloampuerop6)

## v0.4.5 (2014-05-15)

* Add ```FormValidator.Helper.date``` for validating a date, re-used in [date](http://formvalidation.io/validators/date/), [id](http://formvalidation.io/validators/id/), [vat](http://formvalidation.io/validators/vat/) validators
* #233: Add ```threshold``` option
* #232: Add [id validator](http://formvalidation.io/validators/id/)
* #242: Add ```separator``` option to the [numeric validator](http://formvalidation.io/validators/numeric/)
* #248: Add [isin (International Securities Identification Number) validator](http://formvalidation.io/validators/issn/)
* #250: Add [rtn (Routing transit number) validator](http://formvalidation.io/validators/rtn/)
* #251: Add [cusip (North American Securities) validator](http://formvalidation.io/validators/cusip/)
* #252: Add [sedol (Stock Exchange Daily Official List) validator](http://formvalidation.io/validators/sedol/)
* The [zipCode validator](http://formvalidation.io/validators/zipCode/) adds support for Italian, Dutch postcodes
* #245: The [cvv validator](http://formvalidation.io/validators/cvv/) should support spaces in credit card, thanks to [@evilchili](https://github.com/evilchili)
* Change default ```submitButtons``` to ```[type="submit"]``` to support ```input type="submit"```
* #226: Fix the conflict issue with MooTools
* #238: The submit buttons are not sent
* #253: The [iban validator](http://formvalidation.io/validators/iban/) does not work on IE8
* #257: Plugin method invocation don't work
* Fix the issue that the hidden fields generated by other plugins might not be validated
* When parsing options from HTML attributes, don't add the field which hasn't validators. It improves fixes for #191, #223

## v0.4.4 (2014-05-05)

* Add ```FormValidator.Helper.mod_11_10``` method that implements modulus 11, 10 (ISO 7064) algorithm. The helper is then reused in validating [German and Croatian VAT](http://formvalidation.io/validators/vat/) numbers
* Add ```FormValidator.Helper.mod_37_36``` method that implements modulus 37, 36 (ISO 7064) algorithm, used in [GRid validator](http://formvalidation.io/validators/grid/)
* #213: Add [EAN (International Article Number) validator](http://formvalidation.io/validators/ean/)
* #214: Add [GRId (Global Release Identifier) validator](http://formvalidation.io/validators/grid/)
* #215: Add [IMEI (International Mobile Station Equipment Identity) validator](http://formvalidation.io/validators/imei/)
* #216: Add [ISMN (International Standard Music Number) validator](http://formvalidation.io/validators/ismn/)
* #217: Add [ISSN (International Standard Serial Number) validator](http://formvalidation.io/validators/issn/)
* #191, #223: Support using both the ```name``` attribute and ```selector``` option for field
* #206: Indicate success/error tab
* #220: Add UK postcode support for the [zipCode validator](http://formvalidation.io/validators/zipCode/)
* #229: The [date validator](http://formvalidation.io/validators/date/) supports seconds
* #231: Wrong prefix of Laser [credit card](http://formvalidation.io/validators/creditCard/) number

## v0.4.3 (2014-04-26)

* Add ```FormValidator.Helper.luhn``` method that implements the Luhn algorithm
* #77: Add [file validator](http://formvalidation.io/validators/file/)
* #179: Add [vat validator](http://formvalidation.io/validators/vat/), support 32 countries
* #198, #199: Add Canadian Postal Code support for the [zipCode validator](http://formvalidation.io/validators/zipCode/), thanks to [@Francismori7](https://github.com/Francismori7)
* #201: The [choice validator](http://formvalidation.io/validators/choice/) supports ```select``` element
* #202: Activate tab containing the first invalid field
* #205: Plugin method invocation
* #207: IE8 error. The field is only validated when its value is changed. It also fixes #153, #193, #197
* #209: The [```excluded: ':disabled'``` setting](http://formvalidation.io/settings/#excluded) does not work on IE 8, thanks to [@adgrafik](https://github.com/adgrafik)
* #210: The [isbn validator](http://formvalidation.io/validators/isbn/) accepts letters and special characters

## v0.4.2 (2014-04-19)

* #168: Add [siren](http://formvalidation.io/validators/siren/) and [siret](http://formvalidation.io/validators/siret/) validators, thanks to [@jswale](https://github.com/jswale)
* #177: Add [Vehicle Identification Number (VIN) validator](http://formvalidation.io/validators/vin/)
* #184: Add [```excluded``` option](http://formvalidation.io/settings/#excluded)
* #171: The [phone validator](http://formvalidation.io/validators/phone/) now supports +1 country code and area code for US phone number, thanks to [@tomByrer](https://github.com/tomByrer)
* #173: The [remote validator](http://formvalidation.io/validators/remote/) allows to override ```name``` option, thanks to [@jswale](https://github.com/jswale)
* #178: Do not validate fields that ```enabled``` is set to ```false```, thanks to [@henningda](https://github.com/henningda)
* #182: Improve [zipCode validator](http://formvalidation.io/validators/zipCode/), thanks to [@gercheq](https://github.com/gercheq)
* #169: Better to say: ```{validatorname}``` and ```{validatoroption}``` must be lowercase, thanks to [@tomByrer](https://github.com/tomByrer)

## v0.4.1 (2014-04-12)

* #144, #158: Fixed an issue that the custom submit handler is not fired from the second time
* #106: Prevent the [```validate()```](http://formvalidation.io/api/#validate) method from submit the form automatically. So we can call ```validate()``` to validate the form
* #131: Doesn't trigger validation on the first focus
* #145: The row state is now only marked as success if all fields on it are valid
* #157: Added support for element outside of form using the [```selector```](http://formvalidation.io/settings/#fields) option
* #159, #163: User doesn't need to submit the form twice when remote validator complete, thanks to [@jswale](https://github.com/jswale)
* #162: Fix errors in IE 8, thanks to [@adgrafik](https://github.com/adgrafik)
* #166, #167: The [phone validator](http://formvalidation.io/validators/phone/) now also checks the length of US phone number, thanks to [@gercheq](https://github.com/gercheq)

## v0.4.0 (2014-04-03)

* #14, #57: Set validator option by using [HTML 5 attributes](http://formvalidation.io/examples/#attribute)

Form attributes:

```html
<form
    data-bv-message="This value is not valid"
    data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
    data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
    data-bv-feedbackicons-validating="glyphicon glyphicon-refresh"
    >
```

Field attributes:

```html
<input type="text" class="form-control" name="username"
    data-bv-message="The username is not valid"
    data-bv-notempty data-bv-notempty-message="The username is required and cannot be empty"
    data-bv-stringlength="true" data-bv-stringlength-min="6" data-bv-stringlength-max="30" data-bv-stringlength-message="The username must be more than 6 and less than 30 characters long"
    data-bv-different="true" data-bv-different-field="password" data-bv-different-message="The username and password cannot be the same as each other"
    data-bv-remote="true" data-bv-remote-url="remote.php" data-bv-remote-message="The username is not available"
    />
```

* Support [HTML 5 input types](http://formvalidation.io/examples/#html5):

HTML 5 attribute      | Validator
----------------------|----------
```min="..."```       | [greaterThan validator](http://formvalidation.io/validators/greaterThan/)
```max="..."```       | [lessThan validator](http://formvalidation.io/validators/lessThan/)
```maxlength="..."``` | [stringLength validator](http://formvalidation.io/validators/stringLength/)
```pattern="..."```   | [regexp validator](http://formvalidation.io/validators/regexp/)
```required```        | [notEmpty validator](http://formvalidation.io/validators/notEmpty/)
```type="color"```    | [hexColor validator](http://formvalidation.io/validators/color/)
```type="email"```    | [emailAddress validator](http://formvalidation.io/validators/emailAddress/)
```type="range"```    | [between validator](http://formvalidation.io/validators/between/)
```type="url"```      | [uri validator](http://formvalidation.io/validators/uri/)

* #74, #103, #122: Set the custom [trigger event](http://formvalidation.io/settings/#trigger)

It's possible to use ```data-bv-trigger``` attribute:

```html
<form data-bv-trigger="keyup">
    <input type="text" class="form-control" name="firstName" placeholder="First name"
           data-bv-trigger="keyup" />
    ...
    <input type="text" class="form-control" name="lastName" placeholder="First name"
           data-bv-trigger="blur" />
</form>
```

or ```trigger``` option:

```javascript
$(form).bootstrapValidator({
    trigger: 'blur',            // Set for all fields
    fields: {
        firstName: {
            trigger: 'keyup',   // Custom for each field. Can be 'event1 event2 event3'
            validators: {
                ...
            }
        },
        lastName: {
            trigger: 'blur',
            validators: {
                ...
            }
        }
    }
});
```

* #136: Support multiple elements with the [same name](http://formvalidation.io/examples/#fields-with-same-name)

```html
<div class="form-group">
    <input class="form-control" type="text" name="surveyAnswer[]" />
</div>
<div class="form-group">
    <input class="form-control" type="text" name="surveyAnswer[]" />
</div>
<div class="form-group">
    <input class="form-control" type="text" name="surveyAnswer[]" />
</div>
```

* #109: Add [```setLiveMode()``` method](http://formvalidation.io/api/#set-live-mode) to turn on/off the live validating mode
* #114: Add [iban validator](http://formvalidation.io/validators/iban/) for validating IBAN (International Bank Account Number)
* #116: Add [uuid validator](http://formvalidation.io/validators/uuid/), support UUID v3, v4, v5
* #128: Add [numeric validator](http://formvalidation.io/validators/numeric/)
* #135: Add [integer validator](http://formvalidation.io/validators/integer/)
* #138: Add [hex validator](http://formvalidation.io/validators/hex/)
* #139: Add [stringCase validator](http://formvalidation.io/validators/stringCase/) to check a string is lower or upper case
* #137: Register the plugin with [jQuery plugins site](http://plugins.jquery.com/)
* #133: The [regexp validator](http://formvalidation.io/validators/regexp/) allows to pass a string
* #140: Do not validate hidden (```type="hidden"```) and invisible element, thanks to [@easonhan007](https://github.com/easonhan007)
* [```disableSubmitButtons()```](http://formvalidation.io/api/#disable-submit-buttons) is now marked as a public API
* The first parameter of [```updateStatus()``` method](http://formvalidation.io/api/#update-status) now accepts the field name only
* #126: Submit button remains disabled after calling custom ```submitHandler``` and the form is valid
* #132: The ```fields.[fieldName].message``` option is not used when showing the error message

## v0.3.3 (2014-03-27)

* #50: Don't validate disabled element
* #34, #105: Cannot call ```form.submit()``` inside [```submitHandler```](http://formvalidation.io/settings/#submit-handler)
* #77, #117: The [notEmpty validator](http://formvalidation.io/validators/notEmpty/) doesn't work on file input
* #120: Handle case where a field is removed after the bootstrap validation, thanks to [@patmoore](https://github.com/patmoore)

## v0.3.2 (2014-03-21)

* #56: Add [```selector``` option](http://formvalidation.io/settings/#fields) for each field. The field can be defined by CSS validator instead of the ```name``` attribute
* #107: Add [```container``` option](http://formvalidation.io/settings/#fields) for each field to indicate where the error messages are shown
* #5: Add [ip validator](http://formvalidation.io/validators/ip/). Support both IPv4 and IPv6
* #6: Add [isbn validator](http://formvalidation.io/validators/isbn/), support both ISBN 10 and ISBN 13
* #7: Add [step validator](http://formvalidation.io/validators/step/)
* #95: Add [mac validator](http://formvalidation.io/validators/mac/)
* #96: Add [base64 validator](http://formvalidation.io/validators/base64/)
* #97: Add [cvv validator](http://formvalidation.io/validators/cvv/)
* #99, #100: Add [phone validator](http://formvalidation.io/validators/phone/). Support US phone number only, thanks to [@gercheq](https://github.com/gercheq)
* #112: [creditCard validator](http://formvalidation.io/validators/creditCard/) now validates both IIN ranges and length

## v0.3.1 (2014-03-17)

* #4: Add [date validator](http://formvalidation.io/validators/date/)
* #72, #79: Improve [```updateStatus()``` method](http://formvalidation.io/api/#update-status) to make the plugin play well with another
* #80: Add [```enabled``` option](http://formvalidation.io/settings/#fields) and [```enableFieldValidators()``` method](http://formvalidation.io/api/#enable-field-validators) to enable/disable all validators to given field
* #90: Add ```bower.json``` file, thanks to [@ikanedo](https://github.com/ikanedo)
* #3, #92: Support more form controls on the same row
* Remove the ```columns``` option. Now the plugin works normally no matter how many columns the form uses
* #102: The [```resetForm``` method](http://formvalidation.io/api/#reset-form) now only resets fields with validator rules
* #82, #84: The error messages aren't shown if the form field doesn't have label
* #89: [```submitHandler```](http://formvalidation.io/settings/#submit-handler) or default submission isn't called after [remote validation](http://formvalidation.io/validators/remote/) completes

## v0.3.0 (2014-03-10)

* #44: Rewrite entirely using Deferred
* #26, #27, #67: Add [choice validator](http://formvalidation.io/validators/choice/), thanks to [@emilchristensen](https://github.com/emilchristensen)
* #31: The [remote validator](http://formvalidation.io/validators/remote/) supports dynamic data
* #36, #58: Add method to [validate form](http://formvalidation.io/api/#validate) manually
* #41: Disable submit button on successful form submit
* #42: Add submit button to [```submitHandler()```](http://formvalidation.io/settings/#submit-handler) parameter
* #48: Add optional [feedback icons](http://formvalidation.io/settings/#feedback-icons)
* #64: Support [Danish zip code](http://formvalidation.io/validators/zipCode/), thanks to [@emilchristensen](https://github.com/emilchristensen)
* #65: Support [Sweden zip code](http://formvalidation.io/validators/zipCode/), thanks to [@emilchristensen](https://github.com/emilchristensen)
* #70: Support custom grid columns
* #71: Show all errors
* #76: Add [```resetForm()``` method](http://formvalidation.io/api/#reset-form)
* #50: Don't validate disabled element
* #51: Submit after submit doesn't work
* #53, #54: Fix [notEmpty validator](http://formvalidation.io/validators/notEmpty/) for radios and checkboxes, thanks to [@kristian-puccio](https://github.com/kristian-puccio)
* #55: The plugin doesn't validate other fields if the [remote validator](http://formvalidation.io/validators/remote/) returns ```true```
* #62: The [callback validator](http://formvalidation.io/validators/callback/) passes wrong parameter, thanks to [@iplus](https://github.com/iplus)
* #59: Add example for Rail field convention, thanks to [@narutosanjiv](https://github.com/narutosanjiv)
* #60: Update the installation guide, thanks to [@vaz](https://github.com/vaz)
* #73: Describe which version should be [included](http://formvalidation.io/getting-started/#including-library) in the Usage section

## v0.2.2 (2014-01-07)

* #15: Focus to the first invalid element
* #31: [remote validator](http://formvalidation.io/validators/remote/): Allow to set additional data to remote URL
* #32, #43, #47: Only validate not empty field
* #39: Validate existing fields only
* #34: Avoid from calling form submit recursively
* #40: Fix the issue when the form label doesn't have class

## v0.2.1 (2013-11-08)

* #29: Upgrade Bootstrap to v3.0.2
* #30: Hide the error block containers before validating

## v0.2.0 (2013-10-21)

* #24: Add [```live``` option](http://formvalidation.io/settings/#live)
* #20: Add custom submit handler using [```submitHandler``` option](http://formvalidation.io/settings/#submit-handler)
* #9: Add [creditCard validator](http://formvalidation.io/validators/creditCard/)
* #18: Add [different validator](http://formvalidation.io/validators/different/)
* #21: Add [callback validator](http://formvalidation.io/validators/callback/)
* #22: Support form that labels are placed in extra small (```col-xs-```), small (```col-sm-```), medium (```col-md-```) elements
* #25: The [regexp validator](http://formvalidation.io/validators/regexp/) does not work

## v0.1.1 (2013-10-17)

* Added [```submitButtons``` option](http://formvalidation.io/settings/#submit-buttons)
* #16: Added disabling client side validation in HTML 5
* #17: Added support for default Bootstrap form without labels
* #19: Added support for select box validator

## v0.1.0 (2013-10-14)

* First release
* Provide various validators:
    - [between validator](http://formvalidation.io/validators/between/)
    - [digits validator](http://formvalidation.io/validators/digits/)
    - [emailAddress validator](http://formvalidation.io/validators/emailAddress/)
    - [greaterThan validator](http://formvalidation.io/validators/greaterThan/)
    - [hexColor validator](http://formvalidation.io/validators/color/)
    - [identical validator](http://formvalidation.io/validators/identical/)
    - [lessThan validator](http://formvalidation.io/validators/lessThan/)
    - [notEmpty validator](http://formvalidation.io/validators/notEmpty/)
    - [regexp validator](http://formvalidation.io/validators/regexp/)
    - [remote validator](http://formvalidation.io/validators/remote/)
    - [stringLength validator](http://formvalidation.io/validators/stringLength/)
    - [uri validator](http://formvalidation.io/validators/uri/)
    - [zipCode validator](http://formvalidation.io/validators/zipCode/)