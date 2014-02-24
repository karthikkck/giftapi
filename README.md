giftapi
=======

1. JQuery - for accessing dom elements
2. Mustache - for templating and keep the markup dry
3. JStorage - library for localstorage
4. bootstrap css - for quick prototyping of the app

Description:

In-order to improve the performance of the app, I have stored the json data got from api requests in the localstorage,
with a expiry time of 24 hours.

Gifts will be shown in 3 groups - men, women & kids. This can be further enhanced to family, speciality gifts etc.
The code is very general, where changing global settings will change the results shown by the application.

Structure:

index.html - the start page
assets folder - holds all the resources needed
