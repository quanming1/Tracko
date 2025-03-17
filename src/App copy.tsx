import React, { useEffect, useState } from "react";
import "./Style/index.scss";
import { CacheGroup } from "./components/CacheDom/CacheGroup";
import { CacheDom } from "./components/CacheDom/CacheDom";
import { Button } from "antd";

const App: React.FC = () => {
  const [isshow, setIsshow] = React.useState<boolean>(false);
  const [num, setNum] = useState(0);
  return (
    <div className="app-container">
      {/* <RouterProvider router={router} /> */}

      <CacheGroup groupId="test-group" capacity={10}>
        {isshow && (
          <CacheDom deps={[num]} cacheKey="test-dom">
            <div>
              <Comp num={num} />
            </div>
          </CacheDom>
        )}
        <Button onClick={() => setIsshow(() => !isshow)}>切换显示</Button>
        <Button onClick={() => setNum((prev) => prev + 1)}>num ++ button</Button>
      </CacheGroup>
    </div>
  );
};

function Comp({ num }: { num: number }) {
  const [count, setCount] = React.useState<number>(0);

  useEffect(() => {
    console.log("加载了");
  }, []);

  return (
    <div>
      <div>当前计数: {count}</div>
      <div>num: {num}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>点击增加</button>
    </div>
  );
}

export default App;
