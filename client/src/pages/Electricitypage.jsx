import ElectricityTable from "../components/ElectricityTable";

const Electricitypage = () => {
  return (
    <div className="pages">
      <h2 className="pageHeader">Pörssisähkö</h2>
      <p className="headersText">
        Tarkastelee sähkön hintatietoja tälle ja huomiselle päivälle.
      </p>
      <div className="pricesChart">
        <ElectricityTable />
      </div>
    </div>
  );
};

export default Electricitypage;
