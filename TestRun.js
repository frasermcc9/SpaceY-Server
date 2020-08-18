const {
    Setup,
    MaterialGenerator,
    ShipGenerator,
    AttachmentGenerator,
    FactionGenerator,
    NodeGenerator,
    Client,
    AsteroidBuilder,
    PlayerModel,
    layerOneMaterials,
    layerTwoMaterials,
    layerThreeMaterials,
    layerFourMaterials,
} = require("./build/lib/main");

Setup.begin()
    .setupClient({
        databaseName: "spacey",
        databaseUri: "mongodb://localhost:27017",
    })
    .addMaterialLayer(layerOneMaterials())
    .addMaterialLayer(layerTwoMaterials())
    .addMaterialLayer(layerThreeMaterials())
    .addMaterialLayer(layerFourMaterials())
    .finishMaterials()
    .addShips(ShipGenerator.apply(null))
    .addAttachments(AttachmentGenerator.apply(null))
    .addFactions(FactionGenerator.apply(null))
    .addLocations(NodeGenerator.apply(null))
    .addLink("Gemini", "Kalen")
    .addLink("Kalen", "Lyra")
    .addLink("Lyra", "Aries")
    .addLink("Aries", "Auriga")
    .addLink("Auriga", "Orion")
    .addLink("Orion", "Kalen")
    .addLink("Auriga", "Erisna")
    .addLink("Erisna", "Ceti")
    .addLink("Ceti", "Delphinus")
    .addLink("Erisna", "Aquarius")
    .finishMap()
    .defaultAsteroidCooldown(300)
    .defaultCredits(10000)
    .defaultLocation("Gemini")
    .defaultShip("Recovered Escape Pod")
    .maxMaterialRarity(10)
    .maxTechLevel(10)
    .finish();

Client.Reg.Spacemap.updateMap();
setInterval(() => {
    Client.Reg.Spacemap.updateMap();
}, 1000 * 60 * 15);
