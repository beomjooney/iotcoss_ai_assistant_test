export const data = {
  associatedJoinSpec: {
    whereClause: null,
    children: [
      {
        whereClause: {
          fromSide: {
            tableName: 'Business Units Info',
            columnName: 'Business Unit',
            fqname: 'Business Units Info.Business Unit',
          },
          toSide: {
            tableName: 'ServerCMDB',
            columnName: 'Business Unit',
            fqname: 'ServerCMDB.Business Unit',
          },
        },
        children: [
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Server Product',
                fqname: 'ServerCMDB.Server Product',
              },
              toSide: {
                tableName: 'Product Software',
                columnName: 'Product',
                fqname: 'Product Software.Product',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Hostname',
                fqname: 'ServerCMDB.Hostname',
              },
              toSide: {
                tableName: 'Physical Machines',
                columnName: 'Hostname',
                fqname: 'Physical Machines.Hostname',
              },
            },
            children: [
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'VM Cluster',
                    fqname: 'Physical Machines.VM Cluster',
                  },
                  toSide: {
                    tableName: 'Software to VMware Farm Cost Weighting',
                    columnName: 'Key',
                    fqname: 'Software to VMware Farm Cost Weighting.Key',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Data Center',
                    fqname: 'Physical Machines.Data Center',
                  },
                  toSide: {
                    tableName: 'Data Centers Info',
                    columnName: 'Data Center',
                    fqname: 'Data Centers Info.Data Center',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Data Center',
                    fqname: 'Physical Machines.Data Center',
                  },
                  toSide: {
                    tableName: 'Data Centers Misc',
                    columnName: 'Data Center',
                    fqname: 'Data Centers Misc.Data Center',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Data Center',
                    fqname: 'Physical Machines.Data Center',
                  },
                  toSide: {
                    tableName: 'Data Centers Hosting',
                    columnName: 'Data Center',
                    fqname: 'Data Centers Hosting.Data Center',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Data Center',
                    fqname: 'Physical Machines.Data Center',
                  },
                  toSide: {
                    tableName: 'Data Centers Power Costs',
                    columnName: 'Data Center',
                    fqname: 'Data Centers Power Costs.Data Center',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Data Center',
                    fqname: 'Physical Machines.Data Center',
                  },
                  toSide: {
                    tableName: 'currency-test',
                    columnName: 'Subcategory',
                    fqname: 'currency-test.Subcategory',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Physical Machines',
                    columnName: 'Model',
                    fqname: 'Physical Machines.Model',
                  },
                  toSide: {
                    tableName: 'HW Pricing',
                    columnName: 'Hardware',
                    fqname: 'HW Pricing.Hardware',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
            ],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Server Product',
                fqname: 'ServerCMDB.Server Product',
              },
              toSide: {
                tableName: 'Product Info',
                columnName: 'Product',
                fqname: 'Product Info.Product',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Hostname',
                fqname: 'ServerCMDB.Hostname',
              },
              toSide: {
                tableName: 'Server Depreciation',
                columnName: 'Hostname',
                fqname: 'Server Depreciation.Hostname',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'OS',
                fqname: 'ServerCMDB.OS',
              },
              toSide: {
                tableName: 'Operating Systems',
                columnName: 'OS',
                fqname: 'Operating Systems.OS',
              },
            },
            children: [
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Operating Systems',
                    columnName: 'Type',
                    fqname: 'Operating Systems.Type',
                  },
                  toSide: {
                    tableName: 'Server Admins',
                    columnName: 'Type',
                    fqname: 'Server Admins.Type',
                  },
                },
                children: [
                  {
                    whereClause: {
                      fromSide: {
                        tableName: 'Server Admins',
                        columnName: 'CC',
                        fqname: 'Server Admins.CC',
                      },
                      toSide: {
                        tableName: 'GL Actuals',
                        columnName: 'Cost Center',
                        fqname: 'GL Actuals.Cost Center',
                      },
                    },
                    children: [
                      {
                        whereClause: {
                          fromSide: {
                            tableName: 'GL Actuals',
                            columnName: 'ID',
                            fqname: 'GL Actuals.ID',
                          },
                          toSide: {
                            tableName: 'GL Budget',
                            columnName: 'ID',
                            fqname: 'GL Budget.ID',
                          },
                        },
                        children: [],
                        empty: false,
                        automatic: false,
                      },
                    ],
                    empty: false,
                    automatic: false,
                  },
                ],
                empty: false,
                automatic: false,
              },
            ],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Hostname',
                fqname: 'ServerCMDB.Hostname',
              },
              toSide: {
                tableName: 'Server CPU',
                columnName: 'Hostname',
                fqname: 'Server CPU.Hostname',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Service',
                fqname: 'ServerCMDB.Service',
              },
              toSide: {
                tableName: 'Service Info',
                columnName: 'Service',
                fqname: 'Service Info.Service',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Hostname',
                fqname: 'ServerCMDB.Hostname',
              },
              toSide: {
                tableName: 'Virtual Machines',
                columnName: 'Hostname',
                fqname: 'Virtual Machines.Hostname',
              },
            },
            children: [
              {
                whereClause: {
                  fromSide: {
                    tableName: 'Virtual Machines',
                    columnName: 'Virtual ID',
                    fqname: 'Virtual Machines.Virtual ID',
                  },
                  toSide: {
                    tableName: 'Virtual Util',
                    columnName: 'Virtual ID',
                    fqname: 'Virtual Util.Virtual ID',
                  },
                },
                children: [],
                empty: false,
                automatic: false,
              },
            ],
            empty: false,
            automatic: false,
          },
          {
            whereClause: {
              fromSide: {
                tableName: 'ServerCMDB',
                columnName: 'Hostname',
                fqname: 'ServerCMDB.Hostname',
              },
              toSide: {
                tableName: 'Server Disk',
                columnName: 'Hostname',
                fqname: 'Server Disk.Hostname',
              },
            },
            children: [],
            empty: false,
            automatic: false,
          },
        ],
        empty: false,
        automatic: false,
      },
      {
        whereClause: {
          fromSide: {
            tableName: 'Business Units Info',
            columnName: 'Business Unit',
            fqname: 'Business Units Info.Business Unit',
          },
          toSide: {
            tableName: 'BU Service Designation',
            columnName: 'BU',
            fqname: 'BU Service Designation.BU',
          },
        },
        children: [],
        empty: false,
        automatic: false,
      },
    ],
    empty: false,
    automatic: false,
  },
  automatic: true,
};

export const mappingNPriceData = [
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Model',
        fqname: 'Physical Machines.Model',
      },
      toSide: {
        tableName: 'HW Pricing',
        columnName: 'Hardware',
        fqname: 'HW Pricing.Hardware',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Hostname',
        fqname: 'ServerCMDB.Hostname',
      },
      toSide: {
        tableName: 'Physical Machines',
        columnName: 'Hostname',
        fqname: 'Physical Machines.Hostname',
      },
    },
    value: {
      matchRatio: 0.3333333333333333,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Data Center',
        fqname: 'Physical Machines.Data Center',
      },
      toSide: {
        tableName: 'Data Centers Info',
        columnName: 'Data Center',
        fqname: 'Data Centers Info.Data Center',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Server Admins',
        columnName: 'CC',
        fqname: 'Server Admins.CC',
      },
      toSide: {
        tableName: 'GL Actuals',
        columnName: 'Cost Center',
        fqname: 'GL Actuals.Cost Center',
      },
    },
    value: {
      matchRatio: 1.0,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Hostname',
        fqname: 'ServerCMDB.Hostname',
      },
      toSide: {
        tableName: 'Server Disk',
        columnName: 'Hostname',
        fqname: 'Server Disk.Hostname',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'OS',
        fqname: 'ServerCMDB.OS',
      },
      toSide: {
        tableName: 'Operating Systems',
        columnName: 'OS',
        fqname: 'Operating Systems.OS',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Server Product',
        fqname: 'ServerCMDB.Server Product',
      },
      toSide: {
        tableName: 'Product Software',
        columnName: 'Product',
        fqname: 'Product Software.Product',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'VM Cluster',
        fqname: 'Physical Machines.VM Cluster',
      },
      toSide: {
        tableName: 'Software to VMware Farm Cost Weighting',
        columnName: 'Key',
        fqname: 'Software to VMware Farm Cost Weighting.Key',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Hostname',
        fqname: 'ServerCMDB.Hostname',
      },
      toSide: {
        tableName: 'Server Depreciation',
        columnName: 'Hostname',
        fqname: 'Server Depreciation.Hostname',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Service',
        fqname: 'ServerCMDB.Service',
      },
      toSide: {
        tableName: 'Service Info',
        columnName: 'Service',
        fqname: 'Service Info.Service',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Operating Systems',
        columnName: 'Type',
        fqname: 'Operating Systems.Type',
      },
      toSide: {
        tableName: 'Server Admins',
        columnName: 'Type',
        fqname: 'Server Admins.Type',
      },
    },
    value: {
      matchRatio: 0.8333333333333334,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'GL Actuals',
        columnName: 'ID',
        fqname: 'GL Actuals.ID',
      },
      toSide: {
        tableName: 'GL Budget',
        columnName: 'ID',
        fqname: 'GL Budget.ID',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Virtual Machines',
        columnName: 'Virtual ID',
        fqname: 'Virtual Machines.Virtual ID',
      },
      toSide: {
        tableName: 'Virtual Util',
        columnName: 'Virtual ID',
        fqname: 'Virtual Util.Virtual ID',
      },
    },
    value: {
      matchRatio: 0.3333333333333333,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Data Center',
        fqname: 'Physical Machines.Data Center',
      },
      toSide: {
        tableName: 'Data Centers Misc',
        columnName: 'Data Center',
        fqname: 'Data Centers Misc.Data Center',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Business Units Info',
        columnName: 'Business Unit',
        fqname: 'Business Units Info.Business Unit',
      },
      toSide: {
        tableName: 'BU Service Designation',
        columnName: 'BU',
        fqname: 'BU Service Designation.BU',
      },
    },
    value: {
      matchRatio: 1.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Data Center',
        fqname: 'Physical Machines.Data Center',
      },
      toSide: {
        tableName: 'currency-test',
        columnName: 'Subcategory',
        fqname: 'currency-test.Subcategory',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Hostname',
        fqname: 'ServerCMDB.Hostname',
      },
      toSide: {
        tableName: 'Virtual Machines',
        columnName: 'Hostname',
        fqname: 'Virtual Machines.Hostname',
      },
    },
    value: {
      matchRatio: 0.3333333333333333,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Server Product',
        fqname: 'ServerCMDB.Server Product',
      },
      toSide: {
        tableName: 'Product Info',
        columnName: 'Product',
        fqname: 'Product Info.Product',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Data Center',
        fqname: 'Physical Machines.Data Center',
      },
      toSide: {
        tableName: 'Data Centers Hosting',
        columnName: 'Data Center',
        fqname: 'Data Centers Hosting.Data Center',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'ServerCMDB',
        columnName: 'Hostname',
        fqname: 'ServerCMDB.Hostname',
      },
      toSide: {
        tableName: 'Server CPU',
        columnName: 'Hostname',
        fqname: 'Server CPU.Hostname',
      },
    },
    value: {
      matchRatio: 0.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Physical Machines',
        columnName: 'Data Center',
        fqname: 'Physical Machines.Data Center',
      },
      toSide: {
        tableName: 'Data Centers Power Costs',
        columnName: 'Data Center',
        fqname: 'Data Centers Power Costs.Data Center',
      },
    },
    value: {
      matchRatio: 0.6666666666666666,
      cardinalitySpec: 'm',
      linkDirection: 'BOTH',
    },
  },
  {
    key: {
      fromSide: {
        tableName: 'Business Units Info',
        columnName: 'Business Unit',
        fqname: 'Business Units Info.Business Unit',
      },
      toSide: {
        tableName: 'ServerCMDB',
        columnName: 'Business Unit',
        fqname: 'ServerCMDB.Business Unit',
      },
    },
    value: {
      matchRatio: 1.0,
      cardinalitySpec: 'o',
      linkDirection: 'BOTH',
    },
  },
];
