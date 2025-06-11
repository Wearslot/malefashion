if (!customElements.get('review-form')) {
    customElements.define('review-form', class ProductReview extends HTMLElement {
        constructor() {
            super();

            this.rate = 0;

            this.reviewDetails = JSON.parse(localStorage.getItem("reviewDetails"));

            this.comment = this.querySelector('#comment');

            this.fullname = this.querySelector('#fullname');

            this.email = this.querySelector('#email');

            this.rating = this.querySelector("#rating");

            this.feedback = this.querySelector('#feedback');

            if (this.reviewDetails) {
                this.fullname.value = this.reviewDetails.fullname;
                this.email.value = this.reviewDetails.email;
            }

            // this.saveDetails = this.querySelector('#wp-comment-cookies-consent');

            this.submitButton = this.querySelector('#submit');
            this.submitButton.addEventListener("click", this.submitReview.bind(this));

            this.stars = this.querySelectorAll('.star');
            Array.from(this.stars).forEach((star, index) => {
                star.addEventListener('mouseover', () => {
                    const value = parseInt(star.getAttribute("data-value"));
                    this.highlightStars(value);
                });

                star.addEventListener('mouseout', () => {
                    const selectedValue = parseInt(this.rating.value) || 0;
                    this.highlightStars(selectedValue);
                });

                star.addEventListener('click', () => {
                    const value = parseInt(star.getAttribute("data-value"));
                    this.rating.value = value;
                    this.updateRate(value);
                    this.highlightStars(value);
                });
            });
        }

        highlightStars(rating) {
            this.stars.forEach(star => {
                const starValue = parseInt(star.getAttribute("data-value"));
                star.classList.toggle('selected', starValue <= rating);
            });
        }

        updateRate(value) {
            return this.rate = value
        }

        submitReview(event) {
            event.preventDefault();
            this.submitButton.disabled = true
            const oldText = this.submitButton.textContent;
            this.submitButton.textContent = 'Saving ...'

            // if (this.saveDetails.checked === true) {
            //     const reviewDetails = {
            //         email: this.email.value,
            //         fullname: this.fullname.value
            //     };
            //     localStorage.setItem("reviewDetails", JSON.stringify(reviewDetails));
            // }

            if (this.rate !== 0 && this.comment.value !== "" && this.fullname.value !== "" && this.email.value !== "") {
                const config = fetchConfig();
                config.body = JSON.stringify({
                    product_id: this.submitButton.getAttribute("data-id"),
                    rate: this.rate,
                    name: this.fullname.value,
                    comment: this.comment.value,
                    email: this.email.value
                })

                fetch(`${routes.product_review}`, config)
                    .then(response => response.json())
                    .then(data => {
                        this.feedback.innerText = data.message
                    })
                    .catch(err => {
                        this.feedback.innerText = err.message
                    }).finally(() => {
                        this.submitButton.disabled = false;
                        this.submitButton.textContent = oldText;
                    });

            }
        }
    })
}