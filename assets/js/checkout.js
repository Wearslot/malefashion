if (!customElements.get('checkout-form')) {
    customElements.define('checkout-form', class extends HTMLElement {
        constructor() {
            super();

            // this.form = this.querySelector('[form-id="checkout"]');
            // this.form.addEventListener('submit', this.onSubmit.bind(this));

            this.country = this.querySelector('[name="country"]');
            this.country.addEventListener('change', this.onChangeCountry.bind(this));

            // this.email = this.querySelector("#email");
            // this.email.addEventListener('change', this.onEmailInputChange.bind(this));

            // this.querySelectorAll('.input .address-field').forEach(element => {
            //     element.addEventListener('change', this.onAddressInputChange.bind(this))
            // })
        }

        onSubmit(evt) {
            evt.preventDefault();

            const formData = new FormData(this.form);

            var config = fetchConfig();
            config.body = parseFormToJson(formData);

            this.enableLoading();

            fetch('/checkout', config)
                .then(response => response.json())
                .then(response => {

                    if (response.status === 'success') {
                        if (response.link) {
                            window.location.href = response.link;
                        } else if (response.order_no) {
                            window.location.href = `/order/success/${response.order_no}`;
                        }
                    }

                }).catch(error => {
                    console.log(error);
                }).finally(() => {
                    this.disableLoading();
                })
        }

        onChangeCountry(evt) {

            var config = fetchConfig();
            config.body = JSON.stringify({
                country: evt.target.value,
                components: JSON.stringify(this.getAffectedComponents().map(comp => comp.id))
            });

            fetch(`/checkout/states`, config)
                .then(response => response.json())
                .then(response => {
                    if (response.status) {

                    }

                    this.updateAffectedCoponents(this.getAffectedComponents(), response);
                    this.querySelector("#state-select-wrapper").classList.remove('d-none');

                }).catch(error => {
                    console.log(error);
                });
        }

        onAddressInputChange(evt) {

            this.firstname = this.querySelector("#firstname");
            this.lastname = this.querySelector("#firstname");
            this.state = this.querySelector("#state");
            this.address_line_1 = this.querySelector("#address_line_1");
            this.address_line_2 = this.querySelector("#address_line_2");
            this.city = this.querySelector("#city");
            this.postcode = this.querySelector("#postcode");
            this.phone = this.querySelector("#phone");

            const components = JSON.stringify(this.getAddressChangeAffectedComponents().map(comp => comp.id));

            if (this.country.value && this.state.value) {
                this.shippingLoading(true);

                var config = fetchConfig();
                config.body = JSON.stringify({
                    firstname: this.firstname.value,
                    lastname: this.lastname.value,
                    country: this.country.value,
                    state: this.state.value,
                    address_line_1: this.address_line_1.value,
                    address_line_2: this.address_line_1 ? this.address_line_1.value : null,
                    city: this.city.value,
                    postcode: this.postcode ? this.postcode.value : null,
                    phone: this.phone.value,
                    components
                })

                fetch('/checkout/shipping-options', config)
                    .then(response => response.json())
                    .then(response => {
                        if (response.status) {
                            return this.handleError(response.message);
                        }

                        this.updateAffectedCoponents(this.getAddressChangeAffectedComponents(), response);

                    }).catch(error => {
                        console.log(error);
                    }).finally(() => {
                        this.shippingLoading(false);
                    })
            }
        }

        onEmailInputChange(evt) {

            this.subscribe = this.querySelector('#subscribe');
            if (this.subscribe.checked) {
                var config = fetchConfig();
                config.body = JSON.stringify({ email: evt.target.value });
                fetch(`/checkout/update-cart/email`, config)
                    .then(response => response.json())
                    .then(response => {

                    }).catch(error => {
                        console.log(error);
                    }).finally(() => {

                    })
            }
        }

        stateLoading(status) {
            if (status) {
                this.querySelector("#country-state-select-wrapper .loading__spinner").classList.remove('hidden');
            } else {
                this.querySelector("#country-state-select-wrapper .loading__spinner").classList.add('hidden');
            }
        }

        shippingLoading(status) {
            if (status) {
                this.querySelector(".shipping-options-wrapper .loading__spinner").classList.remove('hidden');
                this.querySelector(".shipping-options-wrapper .message").classList.add('d-none');
            } else {
                this.querySelector(".shipping-options-wrapper .loading__spinner").classList.add('hidden');
            }
        }

        enableLoading() {
            this.querySelectorAll('input, select, button').forEach((element) => {
                element.setAttribute('disabled', 'true');
            });

            this.querySelector('button[type="submit"] span').classList.add('d-none');
            this.querySelector('button[type="submit"] .loading__spinner').classList.remove('hidden');
        }

        disableLoading() {
            this.querySelectorAll('input, select, button').forEach((element) => {
                element.removeAttribute('disabled');
            });

            this.querySelector('button[type="submit"] span').classList.remove('d-none');
            this.querySelector('button[type="submit"] .loading__spinner').classList.add('hidden');
        }

        getAffectedComponents() {
            return [
                {
                    id: "state-select-field",
                    selector: ".state-select"
                }
            ];
        }

        getAddressChangeAffectedComponents() {
            return [
                {
                    id: "shipping-options",
                    selector: ".shipping-options"
                },
                {
                    id: "cart-summary",
                    selector: ".cart"
                }
            ];
        }

        updateAffectedCoponents(components, response) {
            components.forEach(component => {
                renderComponents(component.selector, response.components[component.id])
            })
        }
    })
}
