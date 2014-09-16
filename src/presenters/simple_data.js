//Really simple model presenter
var SimpleDataPresenter = function(model){
  this.__model = model;
};

//just return the model's raw data
SimpleDataPresenter.prototype.transform = function(){
  return this.__model.data();
};

//transform an array of models
SimpleDataPresenter.transformModels = function(models){
  return models.map(function(model){
    return new SimpleDataPresenter(model).transform();
  });
}

module.exports = SimpleDataPresenter;