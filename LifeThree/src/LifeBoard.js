import * as THREE from 'three';

export class LifeBoard extends THREE.Group {
    constructor(width, height) {

        super();

        this.width = width;
        this.height = height;

        this.currentState = new Array(this.width);
        this.nextState = [];
        this.meshTab = [];

        this.createMaterials();

        this.initializeArray();

        console.table(this.nextState);
    }

    createMaterials() {
        this.matAlive = new THREE.MeshLambertMaterial();
        this.matAlive.color = new THREE.Color(0x000000);

        this.matDead = new THREE.MeshLambertMaterial();
        this.matDead.color = new THREE.Color(0xffffff);

        this.matBorn = new THREE.MeshLambertMaterial();
        this.matBorn.color = new THREE.Color(0xff0000);
    }

    initializeArray() {

        let geometry = new THREE.BoxBufferGeometry();

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                //Pour toute la première ligne
                if (y == 0) {
                    //On crée un tableau pour les colonnes
                    this.currentState[x] = new Array(this.height);
                }

                //On choisit un nombre aléatoire
                let rand = Math.random();

                //Si le nombre est supérieur à 0.5 la cellule est vivante
                if (rand > 0.5) {
                    this.currentState[x][y] = 2;
                    this.mesh = new THREE.Mesh(geometry, this.matBorn);
                } else {
                    this.currentState[x][y] = 0;
                    this.mesh = new THREE.Mesh(geometry, this.matDead);
                }

                //On place la sphere dans la scène
                this.mesh.position.set(x, 0, y);
                this.mesh.rotation.set(360 * rand, 360 * rand, 360 * rand);
                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;
                this.add(this.mesh);

                //On ajoute le mesh dans le tableau des meshs
                this.meshTab.push(this.mesh);

            }
        }

        //On duplique une première fois le tableau en tant que tableau de nextState
        this.nextState = JSON.parse(JSON.stringify(this.currentState));
    }

    update() {
        //Mise à jour de la logique
        this.updateLogic();

        //Mise à jour de l'affichage
        this.updateBoard();
    }

    updateLogic() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let score = 0;

                //top
                score += this.checkNeighbour(x - 1, y - 1);
                score += this.checkNeighbour(x, y - 1);
                score += this.checkNeighbour(x + 1, y - 1);
                //same line
                score += this.checkNeighbour(x - 1, y);
                score += this.checkNeighbour(x + 1, y);
                //bottom
                score += this.checkNeighbour(x - 1, y + 1);
                score += this.checkNeighbour(x, y + 1);
                score += this.checkNeighbour(x + 1, y + 1);

                //Any live cell with two or three live neighbors survives.
                if (this.currentState[x][y] != 0) {

                    if (score == 2 || score == 3) {

                        this.nextState[x][y] = 1;
                        continue;
                    }
                }

                //Any dead cell with three live neighbors becomes a live cell.
                if (this.currentState[x][y] == 0 && score == 3) {
                    this.nextState[x][y] = 2;
                    continue;
                }

                //All other live cells die in the next generation. Similarly, all other dead cells stay dead.
                this.nextState[x][y] = 0;
            }
        }

        this.currentState = JSON.parse(JSON.stringify(this.nextState));

    }

    updateBoard() {
        for (let y = 0; y < this.height; y++) {

            for (let x = 0; x < this.width; x++) {

                if (this.currentState[x][y] == 2) {
                    this.meshTab[x + y * this.width].material = this.matBorn;
                    continue;
                }

                if (this.currentState[x][y] == 1) {
                    this.meshTab[x + y * this.width].material = this.matAlive;
                    continue;
                }

                this.meshTab[x + y * this.width].material = this.matDead;
            }
        }
    }

    checkNeighbour(x, y) {

        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {

            //Si la cellule est vivante
            if (this.currentState[x][y] != 0) {
                return 1;
            }

        }

        return 0;
    }

}