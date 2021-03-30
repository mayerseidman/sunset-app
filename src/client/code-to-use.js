<div className="error">
    <div className="error-icon">
        <LocationIcon />
    </div>
    <div className="error-log">
        <span>To get your sunset forecast we first need your location permissions to be turned on.</span>
        <a href="#">How to Enable Location Services</a>
    </div>
    </div>:
    <div className="error">
        <div className="error-icon">
        <QuestionMarkIcon />
        </div>
    <div className="error-log">
        <span>We could not get your sunset forecast. Please refresh this page and try again. 
        <br />If it still does not work, try again in 30 minutes.</span>
    </div>
</div>

<ResultsSection
    fetchSunset={ this.findMySunset }
    loadingSunset={ this.state.loadingSunset }
    sendUser={ this.submitUser }
    loadingUser={ this.state.loadingUser }
    submissionSuccess={ this.props.user.submissionSuccess }
    showDocs={ this.showDocs }
    goBack={ this.goBack } 
/>


// var sunset = this.props.sunset;
        // const { duplicatePhoneNumber, errors, invalidPhoneNumber, submissionSuccess} = this.props.user;
        // if (invalidPhoneNumber) {
        //  var type = "invalid";
        // } else if (duplicatePhoneNumber) {
        //  var type = "duplicate";
        // } 
        // if (sunset.sunsetSuccess || this.props.showDocs) {
        //  var className = "hideInformationSection";
        // }
        // var actionsSection = this.renderActionsSection();

        // if (this.state.showSignupForm && submissionSuccess) {
        //  var successNotification = (
        //      <p className="successNotification">
        //          Congrats 🎉! You signed up for a daily sunset SMS. Enjoy those sunset vibes!
        //      </p>
        //  )
        // }
        // if (sunset.sunsetSuccess && submissionSuccess) {
        //  var successNotification = (
        //      <p className="notificationText successText">
        //          Congrats 🎉! You signed up for a daily sunset SMS. Enjoy those sunset vibes!
        //      </p>
        //  )
        // }
        // if (invalidPhoneNumber  || duplicatePhoneNumber) {
        //  var errorDisplay = (<ErrorDisplay ref="errors" type={ type } errors={ errors } />)
        // }
        // return (
        //  <div className={ "section informationSection  " + className }>
        //      <div className="innerContent">
        //          <p className="header">SUNSETS ARE AWESOME</p>
        //          <p className="valuePropText">Dont miss another great sunset! <br/>
        //              View the sunset forecast for your area.
        //          </p>
        //          { actionsSection }
        //          { successNotification }
        //          { this.state.showSignupForm && !submissionSuccess && errorDisplay }
        //      </div>
        //  </div>
        // )