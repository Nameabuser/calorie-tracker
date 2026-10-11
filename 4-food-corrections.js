// Audited food reference and portion corrections. Existing logs are unchanged.
(function(){
var i=FOODS.findIndex(function(x){return x[0]==="Idli (1 standard recipe serving)";});
if(i>=0){
FOODS[i]=["Idli (1 piece, 38 g; USDA)",48.64,{p:2.4168,c:9.5,f:0.133}];
FOOD_META[i]={grams:38,source:"https://fdc.nal.usda.gov/food-search/",status:"USDA reference",note:"USDA FoodData Central ID 2708346: 128 kcal per 100 g; 1 item is 38 g. This weighed reference piece is about 49 kcal. Weigh your own idli; sizes and recipes vary.",micro:{fiber:2.204,sugar:0.703,sodium:95.76,iron:0.3382,calcium:3.8,potassium:88.54}};
}
i=FOODS.findIndex(function(x){return x[0]==="Banana (1)";});
if(i>=0){
FOODS[i][0]="Banana (1 medium, 118 g peeled)";
FOOD_META[i]={grams:118,source:"https://fdc.nal.usda.gov/food-search/",status:"USDA portion reference",note:"USDA FoodData Central ID 173944: raw banana, 89 kcal per 100 g. One medium banana has 118 g edible flesh, about 105 kcal. Peel is excluded; weigh your own portion."};
}
R();
})();
