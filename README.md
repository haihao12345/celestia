# celestiaAirQuery

1. 在根目录下创建`account`文件夹，并在文件夹下创建`needQuery.txt`，一个地址写一行。
2. `npm i`安装依赖。
3. 执行脚本`npx hardhat run ./scripts/queryCel.ts`会在`account`目录下生成`writeResult.txt`。

暂时使用hardhat脚手架，这样package.json依赖比较少，容易审计。