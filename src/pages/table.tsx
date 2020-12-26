import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form ,AutoComplete} from "antd";
const EditableContext = React.createContext<any>("");
const mockVal = (str: string, repeat: number = 1) => {
    return {
      value: str.repeat(repeat),
    };
  };

interface Item {
  [key: string]: any;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const form = useContext(EditableContext);
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const onSearch = (searchText: string) => {
    setOptions(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };
  

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
            dataIndex === 'name' ? 
            <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} is required.`,
              },
            ]}
          >
                <AutoComplete
                  options={options}
                  style={{ width: 200 }}
                  onSearch={onSearch}
                  placeholder="input here"
                  onBlur={save}
                /> 
          </Form.Item> : 
          <Form.Item
            style={{ margin: 0 }}
            name={dataIndex}
            rules={[
              {
                required: true,
                message: `${title} is required.`,
              },
            ]}
          >
              <Input  onPressEnter={save} onBlur={save} />
          </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return (
      <td {...restProps}>{childNode}</td>
  );
};

const TableComponent: React.FC<{}> = () => {
  const [dataSource, changeDataSource] = useState<any>([]);
  const [count, changeCount] = useState<any>();
  useEffect(() => {
    const data = [
      {
        key: "0",
        name: "Edward King 0",
        age: "32",
        address: "London, Park Lane no. 0",
      },
      {
        key: "1",
        name: "Edward King 1",
        age: "32",
        address: "London, Park Lane no. 1",
      },
    ];
    changeDataSource(data);
    changeCount(data.length);
  }, []);
  const initColumns = [
    {
      title: "name",
      dataIndex: "name",
      width: "30%",
      editable: true,
    },
    {
      title: "age",
      dataIndex: "age",
      editable: true,
      width: "30%",
    },
    {
      title: "address",
      dataIndex: "address",
      width: "30%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text: string, record: Item) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleDelete = (key: string) => {
    changeDataSource(dataSource.filter((item: any) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      name: ``,
      age: "",
      address: ``,
    };
    changeDataSource([...dataSource, newData]);
    changeCount(count + 1);
  };

  const handleSave = (row: Item) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    changeDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = initColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        submit
      </Button>
    </div>
  );
};

export default TableComponent;
