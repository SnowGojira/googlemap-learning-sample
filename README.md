## How to Run the Application
This application is the places I want to visit in NY. 
When you download this file, click `index.html` to run this application. 
1. the item on the list has two symbols.
   > when you finish visiting one point, you can click check button. The list item and its associate marker will turn to green. Of course, you can click reset button anytime to redraw the operation.
2. the search input can quickly get a specific location.

## Why I build this App
### API I used

1. google map: to get all the map service.
2. yelp: to get the open time information in the info window content.

### The things I am focusing with

1. `knockout` I combine [the to-do list sample](http://todomvc.com/examples/knockoutjs/) which can help me more familiar with mvvm pattern.
2. `google and yelp` use these two api, I can make sure I fully understand the API callback.
3. `localStorage` this method is very important to improve user's experience.
4. `filter` this method is new to me, need to put more effort.

## Additional Instrument
`HardCodeLocationArray.html` help me to generate `locations` json array object. It don't have any logic association with this app itself.
