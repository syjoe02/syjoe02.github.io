# Create a Jekyll container from a Ruby Alpine image

# Ruby 2.5 or later
FROM ruby:3.2.2-alpine3.17

# Add Jekyall dependencies to Alpine
RUN apk update
RUN apk add --no-cache build-base gcc cmake git 

# Update the Ruby bundler and install Jekyll
RUN gem update bundler
RUN gem install jekyll
RUN gem install bundler  
