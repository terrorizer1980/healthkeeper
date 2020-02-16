import React from 'react';
import { connect } from 'react-redux';
import {ApiService} from '../services';
import {UserAction} from '../actions';

class Login extends React.Component {
  constructor(props) {
    // Inherit constructor
    super(props);
    // State for form data and error message
    this.state = {
      form: {
        username: "",
        key: "",
        error: ""
      },
      isSigningIn: false
    };
    // Bind functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

//  // Runs on every keystroke to update the React state
//  handleChange(event) {
//    const { name, value } = event.target;
//    const { form } = this.state;
//  }
//
  // Runs on every keystroke to update the React state
  handleChange(event) {
    const { name, value } = event.target;
    const { form } = this.state;

    this.setState({
      form: {
        ...form,
        [name]: value,
        error: '',
      },
    });
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  // Handle form submission to call api
  handleSubmit(event) {
    // Stop the default form submit browser behaviour
    event.preventDefault();
    // Extract `form` state
    const { form } = this.state;
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser } = this.props;
    // Set loading spinner to the button
    this.setState({ isSigningIn: true });
    // Send a login transaction to the blockchain by calling the ApiService,
    // If it successes, save the username to redux store
    // Otherwise, save the error state for displaying the message
    return ApiService.login(form)
      .then(() => {
        setUser({ name: form.username });
      })
      .catch(err => {
        this.setState({ error: err.toString() });
      })
      .finally(() => {
        if (this.isComponentMounted) {
          this.setState({ isSigningIn: false });
        }
      });
  }

  render() {
    // Extract data from state
    const { form, error, isSigningIn } = this.state;

    return (
      <div className="Login">
        <div className="title">HealthKeeper - powered by EOSIO</div>
        <div className="description">Please use the Account Name and Private Key generated in the previous page to log into the game.</div>
        <form name="form" onSubmit={this.handleSubmit}>
          <div className="field">
            <label>User name</label>
            <input
              type="text"
              name="username"
              value={form.username}
              placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
              onChange={this.handleChange}
              pattern="[\.a-z1-5]{2,12}"
              required
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label>Key</label>
            <input
              type="password"
              name="key"
              value={form.key}
              onChange={this.handleChange}
              pattern="^.{51,}$"
              required
              autoComplete="new-password"
            />
          </div>
          <div className="field form-error">
            {error && <span className="error">{error}</span>}
          </div>
          <div className="bottom">
            <button type="submit" className="green" loading={isSigningIn}>
              {"CONFIRM"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Login);

