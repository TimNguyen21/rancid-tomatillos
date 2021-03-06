import React, { Component } from 'react';
import { getRatings } from '../../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { apiFetchRatings, apiPostNewRating, apiDeleteRating } from '../../apiCalls/apiCalls';

class MovieDetails extends Component {
  constructor() {
    super();
    this.state = {
      userRating: 0
    }
  }

  componentDidMount = () => {
    this.props.userInfo.id
      && apiFetchRatings(this.props.userInfo.id)
          .then(data => this.props.fetchUserRatings(data.ratings))
  }

  submitNewRating = (e) => {
    e.preventDefault();
    const userId = this.props.userInfo.id;
    const userMovieRating = { movie_id: this.props.id , rating: this.state.userRating }
    apiPostNewRating(userMovieRating, userId)
      .then(response => response.json())
      .then(() => apiFetchRatings(this.props.userInfo.id))
      .then(data => this.props.fetchUserRatings(data.ratings))
  }

  removeRating = (e) => {
    e.preventDefault();
    const userId = this.props.userInfo.id;
    const matchingMovieId = this.props.userRatings.find(rating => rating.movie_id === this.props.id).id;
    apiDeleteRating(userId, matchingMovieId)
      .then(() => apiFetchRatings(this.props.userInfo.id))
      .then(data => this.props.fetchUserRatings(data.ratings))
  }

  updateRating = (e) => {
    this.setState({userRating: parseInt(e.target.value)})
  }

  displayUserRatingConditional = () => {
    if(this.props.userInfo.id){
      return this.showUserRating();
    }
  }

  showUserRating = () => {
   let matchingMovie = this.props.userRatings.find(rating => rating.movie_id === this.props.id);
   if(matchingMovie) {
      return `${matchingMovie.rating}/10`
    } else {
      return "You haven't rated this movie yet!"
    }
  }

  checkIfLoggedIn = () => {
    if(this.props.userInfo.id){
      return (
        <form className="submit-rating-form">
          {this.toggleRatingButtons()}
        </form>
      )
    }
  }

  toggleRatingButtons = () => {
    const matchingMovie = this.props.userRatings.find(rating => rating.movie_id === this.props.id);
    if(matchingMovie) {
      return (
        <section>
          <label htmlFor="remove-rating">Remove Movie Rating: </label>
          <button className="remove-rating" type="submit" onClick={this.removeRating} >Remove Rating</button>
        </section>)
    } else if (!matchingMovie) {
      return (
        <section>
        <label for="rate-movie">Rate Movie: </label>
          <select value={this.state.userRating} onChange={this.updateRating} required>
            <option value="0">--Select a Rating--</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          <button className="submit-rating" type="submit" onClick={this.submitNewRating} disabled={this.state.userRating === 0}>SUBMIT</button>
        </section>)
    }
  }

  render() {
    const { title, backdrop_path, poster_path, release_date, overview, average_rating } = this.props;
    if (title) {
      return (
        <article className="movie-details-card">
          <section className="movie-images">
            <img src={poster_path} alt={"poster for " + title}/>
            <img src={backdrop_path} alt={"background for " + title}/>
          </section>
          <section className="movie-details">
            <section>
              <h1>{title}</h1>
              <h3 className="average-rating">Average rating: <span>{average_rating && average_rating.toFixed(1)}/10</span></h3>

              {this.props.userInfo.id && <h3 className="user-rating">Your rating: <span>{this.displayUserRatingConditional()}</span></h3>}

              <h3>Release date: <span>{release_date.slice(0, 4)}</span></h3>
            </section>
            <section>
              <p>
                {overview}
              </p>
            </section>
            {this.checkIfLoggedIn()}
          </section>
        </article>)
      } else {
        return (
          <section className="movie-details-error">
          <h1>Sorry, this movie does not exist!</h1>
          </section>
        )
      }
    }
}

MovieDetails.propTypes = {
  userInfo: PropTypes.object,
  fetchUserRatings: PropTypes.func,
  movies: PropTypes.array,
  userRatings: PropTypes.array,
  id: PropTypes.number,
  title: PropTypes.string,
  backdrop_path: PropTypes.string,
  poster_path: PropTypes.string,
  release_date: PropTypes.string,
  overview: PropTypes.string,
  average_rating: PropTypes.number
}

const mapDispatchToProps = (dispatch) => ({
  fetchUserRatings: allRatings => dispatch( getRatings(allRatings) )
})

const mapStateToProps = (state) => ({
  movies: state.movies,
  userRatings: state.userRatings,
  userInfo: state.userInfo
})

export default connect(mapStateToProps, mapDispatchToProps)(MovieDetails);
