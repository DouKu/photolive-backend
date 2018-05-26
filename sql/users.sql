CREATE TABLE "public"."users" (
	"id" serial NOT NULL,
	"phone" varchar(20) NOT NULL UNIQUE,
	"username" varchar(50) NOT NULL UNIQUE,
	"password" varchar(512) NOT NULL,
	"nickname" varchar(30) NOT NULL,
	"real_name" varchar(20) NOT NULL,
	"app_secret" varchar(512) NOT NULL,
	"avatar" varchar(512) NOT NULL,
	"sign" varchar(300) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	PRIMARY KEY ("id")
)
WITH (OIDS=FALSE);

COMMENT ON COLUMN "public"."users"."id" IS '主键';
COMMENT ON COLUMN "public"."users"."phone" IS '电话';
COMMENT ON COLUMN "public"."users"."username" IS '登录名';
COMMENT ON COLUMN "public"."users"."password" IS '密码(加盐哈希)';
COMMENT ON COLUMN "public"."users"."nickname" IS '昵称';
COMMENT ON COLUMN "public"."users"."real_name" IS '真实姓名';
COMMENT ON COLUMN "public"."users"."app_secret" IS 'jwt';
COMMENT ON COLUMN "public"."users"."avatar" IS '头像';
COMMENT ON COLUMN "public"."users"."sign" IS '个性签名';
COMMENT ON COLUMN "public"."users"."created_at" IS '注册时间';