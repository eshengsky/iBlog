describe('emailAddress', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="emailAddressForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email-address-or-addresses" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#emailAddressForm').formValidation();

        this.fv = $('#emailAddressForm').data('formValidation');
        this.$emailAddressOrAddresses = this.fv.getFieldElements('email-address-or-addresses');
    });

    afterEach(function() {
        $('#emailAddressForm').formValidation('destroy').remove();
    });

    var validEmailAddresses = [
        'admin@mailserver1',
        'niceandsimple@example.com',
        'very.common@example.com',
        'a.little.lengthy.but.fine@dept.example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-dash@example.com',
        '"much.more unusual"@example.com',
        '"very.unusual.@.unusual.com"@example.com',
        '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com',
        '" "@example.org',
        'üñîçøðé@example.com'
    ];

    var invalidEmailAddresses = [
        // "!#$%&'*+-/=?^_`{}|~@example.org",   // This is actually passing validation; see https://github.com/formvalidation/formvalidation/issues/673
        'üñîçøðé@üñîçøðé.com',
        'Abc.example.com',
        'A@b@c@example.com',
        'a"b(c)d,e:f;gi[j\k]l@example.com',
        'just"not"right@example.com',
        'this is"not\allowed@example.com',
        'this\ still\"not\\allowed@example.com'
    ];

    var validMultipleEmailAddressesForDefaultSeparators = [
        'niceandsimple@example.com,very.common@example.com',
        'niceandsimple@example.com;very.common@example.com',
        'niceandsimple@example.com;very.common@example.com,a.little.lengthy.but.fine@dept.example.com'
    ];

    var invalidMultipleEmailAddressesForDefaultSeparators = [
        'niceandsimple@example.com+very.common@example.com',
        'niceandsimple@example.com|very.common@example.com'
    ];

    var validMultipleEmailAddressesForCommaOrDollarSignSeparators = [
        'niceandsimple@example.com,very.common@example.com',
        'niceandsimple@example.com$very.common@example.com',
        'niceandsimple@example.com,very.common@example.com$a.little.lengthy.but.fine@dept.example.com'
    ];

    var invalidMultipleEmailAddressesForCommaOrDollarSignSeparators = [
        'niceandsimple@example.com;very.common@example.com',
        'niceandsimple@example.com;very.common@example.com,a.little.lengthy.but.fine@dept.example.com'
    ];

    it('Valid email addresses (multiple=false)', function() {
        var that = this;
        $.each(validEmailAddresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=false)', function() {
        var that = this;

        var addresses = invalidEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators)
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators)
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators)
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Invalid email addresses (multiple=false,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,;]/);

        var addresses = invalidEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators)
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators)
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators)
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid email addresses (multiple=true)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);

        var addresses = validEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=true)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);

        var addresses = invalidEmailAddresses
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid email addresses (multiple=true,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,\$]/);

        var addresses = validEmailAddresses
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=true,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,\$]/);

        var addresses = invalidEmailAddresses
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });
});
