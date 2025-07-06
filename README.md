# Project Structure

├── README.md
├── package.json
├── public
│   ├── index.html
│   └── robots.txt
├── server
│   ├── config
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   └── razorpay.js
│   ├── controllers
│   │   ├── Auth.js
│   │   ├── Category.js
│   │   ├── ContactUs.js
│   │   ├── Course.js
│   │   ├── Payments.js
│   │   ├── Profile.js
│   │   ├── RatingAndReview.js
│   │   ├── ResetPassword.js
│   │   ├── Section.js
│   │   ├── Subsection.js
│   │   └── courseProgress.js
│   ├── index.js
│   ├── mail
│   │   └── templates
│   │       ├── contactFormRes.js
│   │       ├── courseEnrollmentEmail.js
│   │       ├── emailVerificationTemplate.js
│   │       ├── passwordUpdate.js
│   │       └── paymentSuccessEmail.js
│   ├── middlewares
│   │   └── auth.js
│   ├── models
│   │   ├── Category.js
│   │   ├── Course.js
│   │   ├── CourseProgress.js
│   │   ├── OTP.js
│   │   ├── Profile.js
│   │   ├── RatingAndReview.js
│   │   ├── Section.js
│   │   ├── SubSection.js
│   │   └── User.js
│   ├── package.json
│   ├── routes
│   │   ├── Contact.js
│   │   ├── Course.js
│   │   ├── Payments.js
│   │   ├── Profile.js
│   │   └── User.js
│   └── utils
│       ├── imageUploader.js
│       ├── mailSender.js
│       └── secToDuration.js
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── Images
│   │       ├── aboutus1.webp
│   │       ├── aboutus2.webp
│   │       ├── aboutus3.webp
│   │       ├── image3.webp
│   │       ├── image8.webp
│   │       ├── image9.webp
│   │       ├── login.webp
│   │       └── signup.webp
│   ├── components
│   │   ├── ContactPage
│   │   │   ├── ContactDetails.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── ContactUsForm.jsx
│   │   ├── common
│   │   │   ├── BackToTop.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── IconBtn.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── ReviewSlider.jsx
│   │   │   ├── Tab.jsx
│   │   │   ├── progess.css
│   │   │   └── progressbar.jsx
│   │   └── core
│   │       ├── AboutPage
│   │       │   ├── ContactFormSection.jsx
│   │       │   ├── LearningGrid.jsx
│   │       │   ├── Quote.jsx
│   │       │   ├── Stats.jsx
│   │       │   └── useIntersectionObserver.js
│   │       ├── Auth
│   │       │   ├── LoginForm.jsx
│   │       │   ├── OpenRoute.jsx
│   │       │   ├── PrivateRoute.jsx
│   │       │   ├── ProfileDropDown.jsx
│   │       │   ├── SignupForm.jsx
│   │       │   └── Template.jsx
│   │       ├── Catalog
│   │       │   ├── CourseSlider.jsx
│   │       │   └── Course_Card.jsx
│   │       ├── Course
│   │       │   ├── CourseAccordionBar.jsx
│   │       │   ├── CourseDetailsCard.js
│   │       │   └── CourseSubSectionAccordion.jsx
│   │       ├── Dashboard
│   │       │   ├── AddCourse
│   │       │   │   ├── CourseBuilder
│   │       │   │   │   ├── CourseBuilderForm.jsx
│   │       │   │   │   ├── NestedView.jsx
│   │       │   │   │   └── SubSectionModal.jsx
│   │       │   │   ├── CourseInformation
│   │       │   │   │   ├── ChipInput.jsx
│   │       │   │   │   ├── CourseInformationForm.jsx
│   │       │   │   │   └── RequirementField.jsx
│   │       │   │   ├── PublishCourse
│   │       │   │   │   └── index.jsx
│   │       │   │   ├── RenderSteps.jsx
│   │       │   │   ├── Upload.jsx
│   │       │   │   └── index.jsx
│   │       │   ├── Cart
│   │       │   │   ├── RenderCartCourses.jsx
│   │       │   │   ├── RenderTotalAmount.jsx
│   │       │   │   └── index.jsx
│   │       │   ├── EditCourse
│   │       │   │   └── index.js
│   │       │   ├── EnrolledCourses.jsx
│   │       │   ├── InstructorCourses
│   │       │   │   └── CoursesTable.jsx
│   │       │   ├── InstructorDashboard
│   │       │   │   ├── Instructor.jsx
│   │       │   │   └── InstructorChart.jsx
│   │       │   ├── MyCourses.jsx
│   │       │   ├── MyProfile.jsx
│   │       │   ├── Settings
│   │       │   │   ├── ChangeProfilePicture.jsx
│   │       │   │   ├── DeleteAccount.jsx
│   │       │   │   ├── EditProfile.jsx
│   │       │   │   ├── UpdatePassword.jsx
│   │       │   │   └── index.jsx
│   │       │   ├── Sidebar.jsx
│   │       │   └── SidebarLink.jsx
│   │       ├── HomePage
│   │       │   ├── Button.jsx
│   │       │   ├── CodeBlocks.jsx
│   │       │   ├── CourseCard.jsx
│   │       │   ├── ExploreMore.jsx
│   │       │   ├── HighlightText.jsx
│   │       │   ├── InstructorSection.jsx
│   │       │   ├── LearningLanguageSection.jsx
│   │       │   └── TimelineSection.jsx
│   │       └── ViewCourse
│   │           ├── CourseReviewModal.jsx
│   │           ├── VideoDetails.jsx
│   │           └── VideoDetailsSidebar.jsx
│   ├── data
│   │   ├── countrycode.json
│   │   ├── dashboard-links.js
│   │   ├── footer-links.js
│   │   ├── homepage-explore.js
│   │   └── navbar-links.js
│   ├── hooks
│   │   ├── useOnClickOutside.js
│   │   └── useRouteMatch.js
│   ├── index.css
│   ├── index.js
│   ├── pages
│   │   ├── About.jsx
│   │   ├── Catalog.jsx
│   │   ├── Chatbot.jsx
│   │   ├── Contact.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Error.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Project.jsx
│   │   ├── Rateus.jsx
│   │   ├── Rating.css
│   │   ├── Signup.jsx
│   │   ├── TermsAndConditions.jsx
│   │   ├── UpdatePassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── ViewCourse.jsx
│   │   └── privacypolicy.jsx
│   ├── reducer
│   │   └── index.js
│   ├── services
│   │   ├── apiconnector.js
│   │   ├── apis.js
│   │   ├── formatDate.js
│   │   └── operations
│   │       ├── SettingsAPI.js
│   │       ├── authAPI.js
│   │       ├── courseDetailsAPI.js
│   │       ├── pageAndComponentData.js
│   │       ├── profileAPI.js
│   │       └── studentFeaturesAPI.js
│   ├── slices
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── courseSlice.js
│   │   ├── profileSlice.js
│   │   └── viewCourseSlice.js
│   └── utils
│       ├── avgRating.js
│       ├── constants.js
│       └── dateFormatter.js
└── tailwind.config.js


# React & Tailwind CSS Starter Pack

This is a starter pack for creating React projects with Tailwind CSS configured. It uses React version **18.2** and Tailwind CSS version **3.2**.

## Usage

This starter pack includes a basic setup for using **Tailwind CSS with React**. To start building your own components and styles, follow these steps:

1. Clone the repository to your local machine.
    ```sh
    git clone https://github.com/thepranaygupta/react-tailwind-css-starter-pack.git
    ```

1. Install the required packages.
    ```sh
    cd react-tailwind-css-starter-pack
    npm install
    ```

1. Start the development server.
    ```sh
    npm start
    ```
1. Open the project in your browser at [`http://localhost:3000`](http://localhost:3000) to view your project.
1. Create your React components and add your styles using Tailwind classes. You can also create new CSS files and import them into your components.

The project is set up to use `postcss-cli` to process your CSS files. You can add your own `tailwind.config.js` file to customize your Tailwind setup.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please feel free to open an issue or a pull request.
