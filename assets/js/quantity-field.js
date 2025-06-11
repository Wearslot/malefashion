if (!customElements.get('quantity-field')) {
    customElements.define('quantity-field', class QuantityField extends HTMLElement {
        constructor() {
            super();

            this.field = this.querySelector('input');
            this.changeEvent = new Event('change', { bubbles: true });

            this.querySelector('.inc').addEventListener('click', this.onPlusClick.bind(this));
            this.querySelector('.dec').addEventListener('click', this.onMinusClick.bind(this));

        }

        onPlusClick() {
            var value = Number(this.field.value);
            var step = Number(this.field.getAttribute('data-step') || 0);

            var max = this.field.value;
            if (this.field.hasAttribute('data-max') && this.field.getAttribute('data-max') != null) {
                max = Number(this.field.getAttribute('data-max'));
            }

            if ((value + step) > max) {
                this.field.value = max;
            } else {
                this.field.value = value + step;
            }

            this.field.dispatchEvent(this.changeEvent);
        }

        onMinusClick() {
            var value = Number(this.field.value);
            var step = Number(this.field.getAttribute('data-step') || 0);

            var min = 1;
            if (this.field.hasAttribute('data-min') && this.field.getAttribute('data-min') != null) {
                min = Number(this.field.getAttribute('data-min'));
            }

            if ((value - step) < min) {
                this.field.value = min;
            } else {
                this.field.value = value - step;
            }

            this.field.dispatchEvent(this.changeEvent);
        }
    })
}