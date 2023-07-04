import { MarkerType } from 'react-flow-renderer';
import { data, mappingNPriceData } from './data';
import _ from 'lodash';

let countOnce = true;
let pos = 0;
let colPos = 0;
const posCount = [];
const traceKey = [];
const columnPosition = [];
const arrayList = {};
const items = data.associatedJoinSpec.children;

findNodes(items, null);

function positioning(items) {
  let isStarted = true;
  colPos += 1;
  _.forEach(items, function (value, key) {
    if (!columnPosition.hasOwnProperty(value.whereClause.fromSide.tableName)) {
      columnPosition[value.whereClause.fromSide.tableName] = { pos: colPos };
      colPos = isStarted ? colPos + 1 : colPos;
      columnPosition[value.whereClause.toSide.tableName] = { pos: colPos };
      isStarted = false;
    } else if (!columnPosition.hasOwnProperty(value.whereClause.toSide.tableName)) {
      columnPosition[value.whereClause.toSide.tableName] = { pos: colPos };
    }
  });
}

function findNodes(items, parentToSide) {
  _.forEach(items, function (value, key) {
    // debugger;
    //console.log(key)

    if (key === 0) {
      pos += 1;
      traceKey.push(pos);
    }
    const findChildren = value.children;
    // const findColumnPosition = posCount++;
    const parentNode = value.whereClause.fromSide.tableName;
    const childNode = value.whereClause.fromSide.columnName;
    const toSideParent = value.whereClause.toSide.tableName;
    const toSideChild = value.whereClause.toSide.columnName;

    const toSide = value.whereClause.toSide;
    const ChildLength = 0;

    let thisParent = null;
    let thisParentChild = null;

    if (countOnce) {
      countOnce = false;
      positioning(items);
    }

    // refering to the toSide parent which has child
    if (parentToSide) {
      // console.log(parentToSide);
      thisParent = parentToSide.tableName;
      thisParentChild = parentToSide.columnName;
    }

    // refering to the nodes which have  connections and childs
    if (!arrayList.hasOwnProperty(parentNode)) {
      arrayList[parentNode] = {};
      arrayList[parentNode].childrens = [toSideChild];
      arrayList[parentNode].pos = pos; // {'section':key,position}
      if (parentToSide) {
        arrayList[parentNode].childrens.push(thisParentChild);
      }
    } else {
      if (arrayList[parentNode].childrens.indexOf(childNode) === -1) {
        arrayList[parentNode].childrens.push(childNode);
      }
    }

    // refering to the nodes which have no connections and only childs
    if (!arrayList.hasOwnProperty(toSideParent)) {
      // console.log('key'+key)
      arrayList[toSideParent] = {};
      arrayList[toSideParent].childrens = [toSideChild];
      arrayList[toSideParent].pos = pos; //{'section':key,position};
    }

    //checking if childrens are there or not then call recurssive function
    if (findChildren.length > 0) {
      positioning(findChildren);
      //console.log(key+","+findChildren);
      /* if(traceKey[key].indexOf === 0){
          pos = pos+1
          posCount.push(pos);
        } */
      findNodes(findChildren, toSide);
    }
  });
}

function addPositioning(key) {
  //_.forEach(arrayList,function(value,key){
  if (columnPosition.hasOwnProperty(key)) {
    return columnPosition[key].pos;
  }
  // })
}
// addPositioning();

// console.log(arrayList);
// console.log(columnPosition);
// console.log(traceKey);

const reactFlowDataStructure = [];

let count = 0;
let idCount = 0;
let xPosIncrementCount = [160, 500, 840, 1180, 1520, 1860, 2200, 2540];
let xPosIncrement = [160, 500, 840, 1180, 1520, 1860, 2200, 2540];
let yPos = 150;
let yPosIncrement = [800, [0], [0], [0], [0], [0], [0], [0]];
const xNyPos = counts => {
  if (counts === 1) {
    // yPosIncrement +=30
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1],
    };
  }
  if (counts === 2) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    // xPosIncrement = xPosIncrement+xPosIncrementCount
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 3) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 4) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 5) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 6) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 7) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  if (counts === 8) {
    yPos = yPos + 100;
    yPosIncrement[counts - 1].push(yPos);
    return {
      x: xPosIncrement[counts - 1],
      y: yPosIncrement[counts - 1][yPosIncrement[counts - 1].length - 1],
    };
  }
  /* if(undefined){
    yPosIncrement +=100;
    return {
      x: xPosIncrement+1520,
      y: yPosIncrement
     }
  } */
};
const createRreactFlowDataStructure = () => {
  _.forEach(arrayList, function (value, key) {
    idCount += 1;
    count = addPositioning(key);
    if (count === undefined) {
      count = 3;
    }
    reactFlowDataStructure.push({
      id: idCount,
      type: 'sourceNode',
      data: { name: key, childrens: value.childrens, pos: count, id: idCount },
      position: xNyPos(count),
    });
  });
};
createRreactFlowDataStructure();
// console.log(reactFlowDataStructure);
// console.log(filteredArray)

const mapNprice = [];

const createFromID = (parent, data, pos) => {
  return pos + '__' + data.split(' ').join('_'); // pos+"__"+parent.split(" ").join("_")+"__"+data.split(" ").join("_");
};

const createToId = (toSideParent, toSideChild) => {
  let toID = '';
  _.forEach(reactFlowDataStructure, function (value, key) {
    if (toSideParent === value.data.name) {
      if (value.data.childrens.indexOf(toSideChild) !== -1) {
        toID = value.id + '__' + toSideChild.split(' ').join('_'); //value.id+"__"+toSideParent.split(" ").join("_")+"__"+toSideChild.split(" ").join("_");
        return false;
      }
    }
  });
  return toID;
};

const updateAmout = value => {
  const val = value * 100;
  return val.toFixed(1) + '%';
};

const feedMappingNPrice = () => {
  _.forEach(mappingNPriceData, function (value, key) {
    const isPresent = false;

    const fromSideParent = value.key.fromSide.tableName;
    const fromSideChild = value.key.fromSide.columnName;
    const toSideParent = value.key.toSide.tableName;
    const toSideChild = value.key.toSide.columnName;
    const amount = value.value.matchRatio;

    _.forEach(reactFlowDataStructure, function (vv, kk) {
      if (fromSideParent === vv.data.name) {
        if (vv.data.childrens.indexOf(fromSideChild) !== -1) {
          const toID = createToId(toSideParent, toSideChild);
          mapNprice.push({
            id: 'e0-' + key,
            source: createFromID(fromSideParent, fromSideChild, vv.id),
            target: toID,
            label: updateAmout(amount),
            labelStyle: { fill: 'red', fontWeight: 700, fontSize: 17 },
            // style: { stroke: "black" },
            // type: "step",
            animated: false,
          });
        }
      }
    });

    /*  mapNprice.push({ id: "e0-"+key, source: "0", target: "1", animated: true })
  arrayList[fromSideParent] */
  });
};

feedMappingNPrice();
// console.log(mapNprice);

const updatedData = _.concat(reactFlowDataStructure, mapNprice);
export default updatedData;
// console.log(JSON.stringify(_.concat(reactFlowDataStructure, mapNprice)));
// console.log(reactFlowDataStructure,mapNprice);
