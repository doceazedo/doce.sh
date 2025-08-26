/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3496319942")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3496319942")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
