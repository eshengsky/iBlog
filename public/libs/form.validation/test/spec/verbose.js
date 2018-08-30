describe('verbose option', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="verboseForm">',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" ',
                        'required data-fv-notempty-message="The full name is required and cannot be empty" ',
                        'data-fv-regexp="true" data-fv-regexp-regexp="^[a-zA-Z\\s]+$" data-fv-regexp-message="The full name can only consist of alphabetical, number, and space" ',
                        'data-fv-stringlength="true" data-fv-stringlength-min="8" data-fv-stringlength-max="40" data-fv-stringlength-message="The full name must be more than 8 and less than 40 characters long" ',
                    '/>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        // The order of validators are alphabetical:
        // - notEmpty
        // - regexp
        // - stringLength
    });

    afterEach(function() {
        $('#verboseForm').formValidation('destroy').remove();
    });

    it('set data-fv-verbose="false" for form', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'false')
                            .formValidation('destroy')
                            .formValidation()
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    it('set data-fv-verbose="false" for field', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .find('[name="fullName"]')
                                .attr('data-fv-verbose', 'false')
                                .end()
                            .formValidation('destroy')
                            .formValidation()
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    it('set verbose: "false" for form', function() {
        var bv        = $('#verboseForm')
                            .formValidation('destroy')
                            .formValidation({ verbose: false })
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    // #1057
    it('set verbose: "false" for field', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .formValidation('destroy')
                            .formValidation({
                                verbose: true,
                                fields: {
                                    fullName: {
                                        verbose: false
                                    }
                                }
                            })
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    // #1055
    it('trigger "err.field.fv" event', function() {
        var validators = [],    // Array of not passed validators
            bv         = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .formValidation('destroy')
                            .formValidation({
                                verbose: true,
                                fields: {
                                    fullName: {
                                        verbose: false
                                    }
                                }
                            })
                            .on('err.field.fv', function(e, data) {
                                validators.push(data.validator);
                            })
                            .data('formValidation'),
            $fullName  = bv.getFieldElements('fullName');

        $fullName.val('');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('notEmpty');

        validators = [];
        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('regexp');

        validators = [];
        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('stringLength');
    });
});
