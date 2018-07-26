function betweenCompareMin() {
    var compareTo = $('#betweenForm').find('[name="minAge"]').val();
    $('#msgMin').html('betweenCompareMin() called; compare to ' + compareTo);
    return compareTo;
};

function betweenCompareMax() {
    var compareTo = $('#betweenForm').find('[name="maxAge"]').val();
    $('#msgMax').html('betweenCompareMax() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    between: {
        compareToMin: function(value, validator, $field) {
            var compareTo = $('#betweenForm').find('[name="minAge"]').val();
            $('#msgMin').html('TestSuite.between.compareToMin() called; compare to ' + compareTo);
            return compareTo;
        },

        compareToMax: function(value, validator, $field) {
            var compareTo = $('#betweenForm').find('[name="maxAge"]').val();
            $('#msgMax').html('TestSuite.between.compareToMax() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('between', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="betweenForm">',
                '<div id="msgMin"></div>',
                '<div id="msgMax"></div>',
                '<div class="form-group">',
                    '<input type="text" name="minAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="maxAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-between data-fv-between-min="18" data-fv-between-max="100" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#betweenForm').formValidation();

        this.fv      = $('#betweenForm').data('formValidation');
        this.$minAge = this.fv.getFieldElements('minAge');
        this.$maxAge = this.fv.getFieldElements('maxAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#betweenForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('50abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('compare to value', function() {
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(120);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'between', 'min', 'minAge');
        this.fv.updateOption('age', 'between', 'max', 'maxAge');

        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(5);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val(20);
        this.$maxAge.val(40);
        this.$age.val(50);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'between', 'min', 'minAge');
        this.fv.updateOption('age', 'between', 'max', 'maxAge');

        this.$minAge.val('2,5');
        this.$maxAge.val('10,5');
        this.$age.val(5);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val('20,5');
        this.$maxAge.val('40,5');
        this.$age.val(50);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'between', 'min', 'betweenCompareMin');
        this.fv.updateOption('age', 'between', 'max', 'betweenCompareMax');

        this.$minAge.val(20);
        this.$maxAge.val(30);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('betweenCompareMin() called; compare to 20');
        expect($('#msgMax').html()).toEqual('betweenCompareMax() called; compare to 30');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));

        this.fv.resetForm();
        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(6);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('betweenCompareMin() called; compare to 2');
        expect($('#msgMax').html()).toEqual('betweenCompareMax() called; compare to 10');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'between', 'min', 'TestSuite.between.compareToMin');
        this.fv.updateOption('age', 'between', 'max', 'TestSuite.between.compareToMax');

        this.$minAge.val(20);
        this.$maxAge.val(30);
        this.$age.val(40);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('TestSuite.between.compareToMin() called; compare to 20');
        expect($('#msgMax').html()).toEqual('TestSuite.between.compareToMax() called; compare to 30');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));

        this.fv.resetForm();
        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(5);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('TestSuite.between.compareToMin() called; compare to 2');
        expect($('#msgMax').html()).toEqual('TestSuite.between.compareToMax() called; compare to 10');
        expect(this.fv.isValid()).toBeTruthy();
    });
});
