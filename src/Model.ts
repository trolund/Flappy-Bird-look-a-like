import * as tf from '@tensorflow/tfjs';

export class Model {

    numStates: number;
    numActions: number;
    batchSize: number;

    network: tf.LayersModel;



    constructor(hiddenLayerSizeOrModel, numStates, numActions, batchSize){
        

        if(hiddenLayerSizeOrModel instanceof tf.LayersModel){
            this.network = hiddenLayerSizeOrModel;
            this.network.summary();
            this.network.compile({optimizer: 'adam', loss: 'meanSquaredError'});
        }else {
            // this.
        }
    }

    defineModel (hiddenLayerSize: any) {
        if(!Array.isArray(hiddenLayerSize)){
            hiddenLayerSize = [hiddenLayerSize]
        }

        // this.network = tf.sequential();
        // hiddenLayerSize.array.forEach((s, i) => {
        //     this.network
            
        // });

    }
}