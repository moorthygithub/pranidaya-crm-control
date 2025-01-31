<div className="p-4  mb-4 " ref={componentRef1}>
  <Typography variant="h6" className="text-gray-700 font-semibold mb-3">
    Animal Stock
  </Typography>
  <table className="w-full border-collapse border border-gray-200 mb-[10px] text-sm">
    <thead>
      <tr className="bg-gray-200">
        <th className="border p-2">Items Name</th>
        <th className="border p-2">Open Balance</th>
        <th className="border p-2">Received</th>
        <th className="border p-2">Consumption</th>
        <th className="border p-2">Close Balance</th>
      </tr>
    </thead>
    <tbody>
      {stock.length === 0 ? (
        <tr>
          <td colSpan="4" className="border p-2 text-center text-gray-500">
            No data available
          </td>
        </tr>
      ) : (
        stock.map((item, index) => (
          <tr key={index} className="border">
            <td className="border p-2 ">{item.animal_type}</td>
            <td className="border p-2 text-center">{item.arrival}</td>
            <td className="border p-2 text-center">{item.born}</td>
            <td className="border p-2 text-center">{item.dead}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>;
