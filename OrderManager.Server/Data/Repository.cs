namespace OrderManager.Server.Data
{
    public abstract class Repository
    {
        //Abstract base class for all of the data repositories 

        protected readonly DBContext _context;

        public Repository(DBContext context)
        {
            _context = context;
        }

    }
}
